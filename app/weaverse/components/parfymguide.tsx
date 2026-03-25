import { AnimatePresence, motion } from "framer-motion";
import { useState, forwardRef } from "react";
import { match } from "ts-pattern";
import { ArrowBackSVG } from "~/components/icons/ArrowBackSVG";
import InputQuestion from "~/components/quiz/questions/InputQuestion";
import MultiChoiceQuestion from "~/components/quiz/questions/MultipleChoiceQuestion";
import { Originals } from "~/components/quiz/questions/Originals";
import { QuizResults } from "~/components/quiz/QuizResults";
import { QuizBeginScreen } from "~/components/quiz/QuizStartView";
import { QuizWrapper } from "~/components/quiz/QuizWrapper";
import { getQuestionValue, MultipleChoiceQuestion as MultipleChoiceQuestionType } from "~/data/questions";
import { usePerfumeQuiz } from "~/lib/quiz";
import { useI18n } from "~/components/i18n-provider";
import { HydrogenComponentSchema } from '@weaverse/hydrogen';
import { QuizPageView } from "~/components/quiz/quiz-page-view";

const PerfymeGuideSection = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <div ref={ref} className="flex flex-col justify-center items-center">
            <div className="flex flex-col items-center justify-center gap-4 relative w-full px-5 lg:px-8">
                <QuizPageView />
            </div>
        </div>
    );
});

export const schema: HydrogenComponentSchema = {
    type: 'parfyme-guide',
    title: 'Parfyme Guide',
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [],
};

export default PerfymeGuideSection;
