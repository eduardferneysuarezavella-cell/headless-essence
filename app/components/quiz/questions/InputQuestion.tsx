import { motion } from "framer-motion";

import { useState } from "react";
import { ExtensiveChoice, Question } from "~/data/questions";
import { useI18n } from '../../../components/i18n-provider';
import { useTranslation } from "~/i18n/i18n";

type InputQuestionState = {
    name: string;
    email: string;
    newsletter: boolean;
    error: {
        field: string;
        message: string;
    } | null;
}

interface InputQuestionProps {
    question: Question;
    onSkipQuestion: () => void;
    onContinue: () => void;
    onQuestionAnswered: (answer: (string | ExtensiveChoice)[]) => void;
}

export default function InputQuestion({ question, onSkipQuestion, onContinue, onQuestionAnswered }: InputQuestionProps) {
    const [state, setState] = useState<InputQuestionState>({
        name: '',
        email: '',
        newsletter: false,
        error: null
    });
    const { t: _ } = useTranslation();

    const handleInputChange = (key: keyof InputQuestionState, value: string) => {
        setState((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        if (state.newsletter) {
            const errors: InputQuestionState['error'][] = [];

            if (!state.name) errors.push({ field: 'name', message: 'Du måste fylla i ditt namn' });
            if (!state.email) errors.push({ field: 'email', message: 'Du måste fylla i din e-post' });

            if (state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) errors.push({ field: 'email', message: 'Du måste fylla i en giltig e-post.' });

            setState((prev) => ({ ...prev, error: errors.length > 0 ? errors[0] : null }));

            if (errors.length > 0) return;

            onQuestionAnswered([state.name, state.email]);
        }

        onContinue();
    }

    return (
        <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4 } }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="flex flex-col gap-4 w-full"
        >
            <div className="flex items-center justify-center">
                <input
                    type="checkbox"
                    id="subscribe"
                    checked={state.newsletter}
                    onChange={(e) => setState((prev) => ({ ...prev, newsletter: e.target.checked }))}
                    className="mr-2"
                />
                <label htmlFor="subscribe" className="text-md">
                    {_('quiz.form.newsletter')}
                </label>
            </div>

            {state.newsletter && (
                <>
                    <input
                        type="text"
                        placeholder={_('quiz.form.name.placeholder')?.toString()}
                        autoComplete="name"
                        className="px-2 py-1 border border-zinc-700"
                        style={{ borderRadius: "0" }}
                        value={state.name}
                        onInput={(event) => handleInputChange("name", event.currentTarget.value)}
                        onChange={(event) => handleInputChange("name", event.target.value)}
                        required
                    />

                    {state.error && state.error.field === 'name' && <p className="text-sm text-red-500">{state.error.message}</p>}

                    <input
                        type="email"
                        placeholder={_('quiz.form.email.placeholder')?.toString()}
                        autoComplete="email"
                        className="px-2 py-1 border border-zinc-700"
                        style={{ borderRadius: "0" }}
                        value={state.email}
                        onInput={(event) => handleInputChange("email", event.currentTarget.value)}
                        onChange={(event) => handleInputChange("email", event.target.value)}
                        required
                    />

                    {state.error && state.error.field === 'email' && <p className="text-sm text-red-500">{state.error.message}</p>}

                    <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-500">
                            {_('quiz.form.terms', {
                                link: (value) => (
                                    <a
                                        href="https://essnce.se/policies/terms-of-service"
                                        target="_blank"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {value} 
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {state.error && state.error.field === 'global' && <p className="text-sm text-red-500">{state.error.message}</p>}

                </>
            )}

            <button
                onClick={handleSubmit}
                className="bg-[#222] hover:bg-black text-white w-full py-2"
            >
                {_('quiz.showResults')}
            </button>
        </motion.div>
    )
}
