import { Image } from "@shopify/hydrogen";
import { motion } from "framer-motion";
import { useState } from "react";
import { match } from "ts-pattern";
import { ExtensiveChoice, getQuestionValue, isExtensiveChoice, MultipleChoiceQuestion, Question } from "~/data/questions";
import { useTranslation } from "~/i18n/i18n";

interface MultipleChoiceQuestionProps {
    question: MultipleChoiceQuestion;
    onQuestionAnswered: (answer: (string | ExtensiveChoice)[]) => void;
    onSkipQuestion: () => void;
}

export default function MultiChoiceQuestion({ question, onQuestionAnswered, onSkipQuestion }: MultipleChoiceQuestionProps) {
    const { t: _ } = useTranslation();
    const [selectedChoices, setSelectedChoices] = useState<(string | ExtensiveChoice)[]>([]);

    const handleChoiceToggle = (choice: string | ExtensiveChoice) => {
        const selected = selectedChoices.indexOf(choice);
        let newChoices = [...selectedChoices];

        if (selected !== -1) {
            newChoices = newChoices.filter((c) => c !== choice);
        } else {
            if (selectedChoices.length < (question.maxChoices ?? 1)) {
                newChoices.push(choice);
            } else if (question.maxChoices === 1) {
                newChoices = [choice];
            }
        }

        setSelectedChoices(newChoices);

        onQuestionAnswered(newChoices);
    }

    const layout = question.choices?.some((choice) => isExtensiveChoice(choice) && choice.image) ? 'image' : 'text';

    return (
        <motion.div
            key={question.id}
            initial={{ opacity: 0, }}
            animate={{ opacity: 1, transition: { duration: 0.8 } }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className={`${layout === 'image' ? 'grid grid-cols-2 md:grid-cols-4 items-center gap-x-2 md:gap-x-4 gap-y-2' : 'flex flex-col gap-2'}`}
        >
            {question.choices?.map((choice, index) => {
                const isSelected = selectedChoices.includes(choice);

                return match(layout)
                    .with('image', () => (
                        <div key={index} className="flex flex-col w-auto cursor-pointer" onClick={() => handleChoiceToggle(choice)}>
                            <div className="relative overflow-hidden aspect-square">
                                <Image
                                    src={isExtensiveChoice(choice) ? choice.image || '' : ''}
                                    width={150}
                                    height={150}
                                    className={`aspect-square object-contain duration-300 transition-all h-[150px] w-[150px] border border-black border-b-0 ${isSelected ? 'border-b' : ''}`}
                                    style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                                    alt="Doftbild"
                                />
                            </div>

                            <button
                                onClick={() => handleChoiceToggle(choice)}
                                className={`flex flex-col items-center justify-center px-4 py-2 cursor-pointer border w-auto text-sm border-black w-[300px] active:bg-black active:text-white md:hover:bg-black md:hover:text-white transition-all ${isSelected ? 'bg-black text-white' : ''}`}
                            >
                                {isExtensiveChoice(choice) ? (choice.translationKey ? _(choice.translationKey) : choice.title) : choice}
                            </button>
                        </div>
                    ))
                    .with('text', () => (
                        <button
                            key={index}
                            onClick={() => handleChoiceToggle(choice)}
                            className={`flex flex-col items-center justify-center px-4 py-2 cursor-pointer border border-black w-[300px] active:bg-black active:text-white md:hover:bg-black md:hover:text-white transition-all ${isSelected ? 'bg-black text-white' : ''}`}
                        >
                            {isExtensiveChoice(choice) ? (choice.translationKey ? _(choice.translationKey) : choice.title) : choice}
                        </button>
                    ))
                    .otherwise(() => null);
            })}
        </motion.div>
    )
}