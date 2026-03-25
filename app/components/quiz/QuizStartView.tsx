import { Image } from "@shopify/hydrogen";
import { QuizWrapper } from "./QuizWrapper";
import { PerfumeGuideForm } from "./PerfumeGuideForm";
import { useI18n } from "../i18n-provider";
import { sendQuizAnalytics } from "./PerfumeGuideContext";
import { PerfumeEventsName } from "./analytic-types";
import { useTranslation } from "~/i18n/i18n";

interface QuizBeginScreenProps {
    onStart: () => void;
}

export const QuizBeginScreen = ({ onStart }: QuizBeginScreenProps) => {
    const { t: _ } = useTranslation();

    const handleStart = () => {
        sendQuizAnalytics({
            eventName: PerfumeEventsName.QUIZ_STARTED,
            payload: {
                sessionId: 'TEST',
            }
        })

        onStart();
    }

    return (
        <QuizWrapper>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full gap-4 justify-center items-center">
                    <div className="md:hidden block pb-4">
                        <Image
                            width={1000}
                            height={500}
                            src="/cover/Vanillalover-1.jpeg"
                            alt="ESSNCE Cover"
                            className="w-full object-contain"
                        />
                    </div>
                    <h1 className="text-3xl lg:text-[45px] lg:leading-[50px] font-bold max-w-[400px] lg:max-w-[500px] justify-center text-center font-heading">
                        {_('quiz.title')}
                    </h1>
                    <p className="max-w-[500px] text-center lg:text-lg">
                        {_('quiz.description')}
                    </p>
                    <div className="w-full px-4 md:px-0">
                        <button
                            type="submit"
                            className="border border-black py-2 w-full mt-4 active:bg-black active:text-white md:hover:bg-black md:hover:text-white transition-all"
                            onClick={handleStart}
                        >
                            {_('quiz.startButton')}
                        </button>
                    </div>
                    <div className="md:hidden block pt-4">
                        <Image
                            width={1000}
                            height={500}
                            src="/cover/Vanillalover-1.jpeg"
                            alt="ESSNCE Cover"
                            className="w-full object-contain"
                        />
                    </div>
                </div>
                <div className="hidden md:block justify-center items-center">
                    <img width={1000} height={500} src="/cover/bg-desktop.jpeg" alt="ESSNCE Cover" className="" />
                </div>
            </div>
        </QuizWrapper>
    );
};