import { useCallback, useState } from "react";
import { match } from "ts-pattern";
import { Answers, ExtensiveChoice, findProductsSortedByScent, Finish, getProductFromOriginal, getProductsFromResults, getQuestionValue, isExtensiveChoice, isMultipleChoiceQuestion, isOriginal, NextQuestion, Original, products, questions, Result, Results } from "~/data/questions";
import { useTranslation } from "~/i18n/i18n";

export const usePerfumeQuiz = () => {
    const { t: _ } = useTranslation();
    const [answers, setAnswers] = useState<Answers>({});
    const [results, setResults] = useState<Results>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [finished, setFinished] = useState<boolean>(false);
    const [loadingProgress, setLoadingProgress] = useState<number>(0);
    const [questionHistory, setQuestionHistory] = useState<number[]>([0]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    const onContinue = (answer?: (string | ExtensiveChoice | Original)[], newAnswers?: Answers) => {
        let nextQuestionValue = NextQuestion;
        if (answer && answer.length === 1 && isExtensiveChoice(answer[0])) {
            nextQuestionValue = answer[0].goto ?? NextQuestion;
        }

        if (currentQuestion.calculateResults) {
            const newResults = calculateResults(newAnswers);
            setResults(newResults);
        }
    
        if (nextQuestionValue === Finish || currentQuestionIndex === questions.length - 1) {
            setLoading(true);

            const progressInterval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 20);

            const finalResults = calculateResults();
            setResults(finalResults);

            setTimeout(() => {
                setLoading(false);
                setFinished(true);
                setLoadingProgress(0);
                clearInterval(progressInterval);
            }, 2000);

            return;
        }

        setCurrentQuestionIndex((currentIndex) => {
            const nextIndex = nextQuestionValue === NextQuestion
                ? currentIndex + 1
                : questions.findIndex((question) => question.id === nextQuestionValue);

            setQuestionHistory(prev => [...prev, nextIndex]);

            return nextIndex;
        });
    };

    const handleQuestionAnswered = (answer: (string | ExtensiveChoice | Original)[]) => {
        const category = currentQuestion.category;
        const maxChoices = currentQuestion.type === 'multiple-choice' ? currentQuestion.maxChoices ?? 1 : (currentQuestion.type === 'originals' ? 1 : undefined);

        const newAnswers = !category 
            ? (() => {
                const choiceCategories = answer
                    .filter((a): a is ExtensiveChoice => typeof a !== 'string')
                    .map(a => a.category);

                const uniqueCategory = choiceCategories.length === answer.length
                    && new Set(choiceCategories).size === 1
                    && choiceCategories[0];

                return uniqueCategory ? { ...answers, [uniqueCategory]: answer } : answers;
            })()
            : { ...answers, [category]: answer };

        setAnswers(newAnswers);
        
        if (maxChoices === 1) {
            onContinue(answer, newAnswers); 
        }
    }

    const calculateResults = useCallback((newAnswers?: Answers): Results => {
        const currentAnswers = newAnswers ?? answers;

        if (isEqualValue(currentAnswers.LookingForSimilar?.[0], 'Ja')) {
            const originalMatch = currentAnswers.PerfumeBrand?.[0];
            const product = getProductFromOriginal(originalMatch as Original);

            if (!product) {
                return [];
            }

            return [{ type: 'Original', result: [product] }];
        };

        const intensity = currentAnswers.ScentIntensity?.[0];
        const families = currentAnswers.ScentFamily;
        const gender = currentAnswers.PerfumeGender?.[0];

        if (!intensity || !families || !gender || families.length === 0) {
            return [];
        }

        const matchingProducts = products.filter((product) => {
            return product.intensity.includes(getQuestionValue(intensity))
                && product.sex.includes(getQuestionValue(gender))
        });

        return match(families.length)
            .with(3, () => {
                return families.map(family => ({
                    type: getQuestionValue(family),
                    result: findProductsSortedByScent(matchingProducts, getQuestionValue(family)).slice(0, 2)
                }));
            })
            .with(2, () => {
                const [scentA, scentB] = families.map(getQuestionValue);
                const matches = matchingProducts.filter((product) => {
                    const a = product.scent_family.some((scent) => scent.hasOwnProperty(scentA));
                    const b = product.scent_family.some((scent) => scent.hasOwnProperty(scentB));
                    return a && b;
                });

                const matchesA = findProductsSortedByScent(matches.filter((product) => !matches.includes(product)), scentA);
                const matchesB = findProductsSortedByScent(matches.filter((product) => !matches.includes(product)).filter((product) => matchesA.includes(product)), scentB);

                return [
                    { type: `${scentA}/${scentB}`, result: matches.slice(0, 2) },
                    { type: scentA, result: matchesA.slice(0, 2) },
                    { type: scentB, result: matchesB.slice(0, 2) }
                ]
            })
            .with(1, () => {
                return [{
                    type: getQuestionValue(families[0]),
                    result: findProductsSortedByScent(matchingProducts, getQuestionValue(families[0])).slice(0, 6)
                }];
            })
            .otherwise(() => {
                return [];
            });
    }, [answers]);


    const isEqualValue = (a: string | ExtensiveChoice | Original | undefined, value: string) => {
        if (!a) {
            return false;
        }

        return getQuestionValue(a) === value;
    };

    const moveToQuestion = (questionId: string) => {
        setCurrentQuestionIndex(questions.findIndex((question) => question.id === questionId));
    }

    const handleSkipQuestion = () => {
        onContinue();
    }

    const handlePreviousQuestion = () => {
        if (currentQuestion.category) {
            const { [currentQuestion.category]: _, ...remainingAnswers } = answers;
            setAnswers(remainingAnswers);
        }

        setQuestionHistory(prev => prev.slice(0, -1));
        const previousIndex = questionHistory[questionHistory.length - 2] ?? 0;
        setCurrentQuestionIndex(previousIndex);
    }

    const formatQuestion = (question: string) => {
        const resultCount = getProductsFromResults(results).length;

        return _(question)?.toString().replace('{{result}}', resultCount.toString()) as string;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isContinueButton = isMultipleChoiceQuestion(currentQuestion) && (currentQuestion.maxChoices !== 1 && currentQuestion.maxChoices !== undefined);

    return {
        currentQuestion: {
            ...currentQuestion,
            question: formatQuestion(currentQuestion.question)
        },
        loading,
        answers,
        loadingProgress,
        currentQuestionIndex,
        handlePreviousQuestion,
        handleQuestionAnswered,
        moveToQuestion,
        handleSkipQuestion,
        onContinue, 
        finished,
        isContinueButton,
        results
    };
}; 