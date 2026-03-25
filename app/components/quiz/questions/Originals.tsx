'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Original, originals } from "~/data/questions";
import { useTranslation } from "~/i18n/i18n";

interface OriginalsProps {
    selectedGender: string | undefined;
    moveToQuestion: (questionId: string) => void;
    onAnswer: (original: Original[]) => void;
}

export const Originals = ({
    selectedGender,
    moveToQuestion,
    onAnswer
}: OriginalsProps) => {
    const { t: _ } = useTranslation();
    const [query, setQuery] = useState<string>('');
    const [currentOriginal, setCurrentOriginal] = useState<Original>();

    const onSelect = (original: Original) => {
        setCurrentOriginal(original);

        onAnswer([original]);
    };

    const moveToQuestionFive = () => {
        moveToQuestion('Q5');
    };

    const originalKey = originals.map((original) => original.name).join(',');

    return (
        <div>
            <motion.div
                key={originalKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.4 } }}
                exit={{ opacity: 0, transition: { duration: 0.4 } }}
                className="flex flex-col gap-6 w-full"
            >
                <div className="relative border-b border-[#eaeaea] py-6">
                    <input
                        onChange={(event) => setQuery(event.target.value.toLowerCase())}
                        placeholder={_('quiz.questions.Q3.placeholder')?.toString()}
                        style={{ borderRadius: '0' }}
                        className="border border-black w-full px-2 lg:px-9 py-2"
                    />

                    <button
                        onClick={moveToQuestionFive}
                        className="flex flex-col items-center justify-center px-4 py-2 cursor-pointer border border-black w-full active:bg-black active:text-white md:hover:bg-black md:hover:text-white transition-all mt-4"
                    >
                        {_('quiz.questions.Q3.unableToFind')}
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {originals.filter(original => original.name.toLowerCase().startsWith(query) || original.brand.toLowerCase().startsWith(query)).filter((original) => original.genders.includes(selectedGender ?? ''))
                        .sort((a, b) => {
                            if (a.brand === b.brand) {
                                return a.name.localeCompare(b.name);
                            }
                            return a.brand.localeCompare(b.brand);
                        })
                        .map((original, index) => {
                            const isSelected = original.id === currentOriginal?.id;

                            return (
                                <button
                                    key={index}
                                    onClick={() => onSelect(original)}
                                    className={`flex flex-col items-center justify-center px-4 py-2 cursor-pointer border w-[300px] border-black active:bg-black active:text-white md:hover:bg-black md:hover:text-white transition-all ${isSelected ? 'bg-black text-white' : ''}`}
                                >
                                    <span className="text-sm">{original.brand}</span>

                                    {original.name}
                                </button>
                            )
                        })}
                </div>
            </motion.div>
        </div>
    )
}