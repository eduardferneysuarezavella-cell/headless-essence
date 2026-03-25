import { Link } from "@remix-run/react";
import { Image } from "@shopify/hydrogen";
import { ActionFunctionArgs, json, MetaFunction, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { match } from "ts-pattern";
import { ArrowBackSVG } from "~/components/icons/ArrowBackSVG";
import { PerfumeGuideForm } from "~/components/quiz/PerfumeGuideForm";
import InputQuestion from "~/components/quiz/questions/InputQuestion";
import MultiChoiceQuestion from "~/components/quiz/questions/MultipleChoiceQuestion";
import { Originals } from "~/components/quiz/questions/Originals";
import { QuizResults } from "~/components/quiz/QuizResults";
import { QuizBeginScreen } from "~/components/quiz/QuizStartView";
import { QuizWrapper } from "~/components/quiz/QuizWrapper";
import { getProductsFromResults, getQuestionValue, MultipleChoiceQuestion } from "~/data/questions";
import { usePerfumeQuiz } from "~/lib/quiz";
import { useI18n } from "~/components/i18n-provider";
import { useTranslation } from "~/i18n/i18n";

export const meta: MetaFunction = () => {
    return [{ title: 'Parfymguide - Hitta din signaturdoft! | ESSNCE' }];
};


export default function PerfumeQuizPage() {
    const quiz = usePerfumeQuiz();
    const { t: _ } = useTranslation();
    useEffect(() => {
        document.title = _('quiz.seo.title')?.toString() || 'Parfymguide - Hitta din signaturdoft! | ESSNCE';
    }, [_]);

    const [started, setStarted] = useState<boolean>(false);

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col items-center justify-center gap-4 relative w-full px-5 lg:px-8">
                <AnimatePresence>
                    {!started && <QuizBeginScreen onStart={() => setStarted(true)} />}

                    {started && quiz.finished && !quiz.loading && (
                        <QuizResults results={quiz.results} answers={quiz.answers} />
                    )}

                    {started && !quiz.finished && quiz.loading && (
                        <div className="flex flex-col gap-4 items-center justify-center pt-8">
                            <div className="w-full bg-white border border-black rounded-md">
                                <div
                                    className="h-2.5 bg-black rounded-md"
                                    style={{ width: `${quiz.loadingProgress}%` }}
                                ></div>
                            </div>
                            <h1 className="text-2xl">{_('quiz.loading')}</h1>
                        </div>
                    )}

                    {started && !quiz.finished && !quiz.loading && (
                        <QuizWrapper>
                            {quiz.currentQuestionIndex !== 0 && (
                                <div className="absolute bottom-0 left-6 cursor-pointer">
                                    <div className="w-[30px] px-0 py-1.5" onClick={quiz.handlePreviousQuestion}>
                                        <ArrowBackSVG />
                                    </div>
                                </div>
                            )}

                            <motion.div
                                key={quiz.currentQuestion.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { duration: 0.8 } }}
                                exit={{ opacity: 0, transition: { duration: 4 } }}
                                className="flex flex-col gap-8 items-center"
                            >
                                <h2 className="text-2xl">{quiz.currentQuestion.question}</h2>

                                {match(quiz.currentQuestion.type)
                                    .with('multiple-choice', () => (
                                        <MultiChoiceQuestion
                                            question={quiz.currentQuestion as MultipleChoiceQuestion}
                                            onQuestionAnswered={quiz.handleQuestionAnswered}
                                            onSkipQuestion={quiz.handleSkipQuestion}
                                        />
                                    ))
                                    .with('input', () => (
                                        <InputQuestion
                                            question={quiz.currentQuestion}
                                            onQuestionAnswered={quiz.handleQuestionAnswered}
                                            onSkipQuestion={quiz.handleSkipQuestion}
                                            onContinue={quiz.onContinue}
                                        />
                                    ))
                                    .with('originals', () => (
                                        <Originals
                                            selectedGender={getQuestionValue(quiz.answers['PerfumeGender']?.[0])}
                                            onAnswer={quiz.handleQuestionAnswered}
                                            moveToQuestion={quiz.moveToQuestion}
                                        />
                                    ))
                                    .otherwise(() => null)}
                            </motion.div>

                            {quiz.isContinueButton && (
                                <div className="absolute bottom-0 right-6 cursor-pointer">
                                    <button
                                        className="flex flex-col items-center justify-center px-4 py-2 cursor-pointer border text-sm border-black w-[300px] active:bg-black active:text-white md:hover:bg-black md:hover:text-white transition-all"
                                        onClick={() => quiz.onContinue()}
                                    >
                                        {_('quiz.continue')}
                                    </button>
                                </div>
                            )}
                        </QuizWrapper>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}