type QuizAnalyticsBase = {
    sessionId: string;
};

export const PerfumeEventsName = {
    SESSION_CREATED: 'SESSION_CREATED',
    QUIZ_STARTED: 'QUIZ_STARTED',
    QUESTION_ANSWERED: 'QUESTION_ANSWERED',
    QUIZ_COMPLETED: 'QUIZ_COMPLETED',
    QUIZ_SKIPPED: 'QUIZ_SKIPPED',
} as const;

export type QuizEventType = keyof typeof PerfumeEventsName;

export interface QuizStartedPayload extends QuizAnalyticsBase { };
export interface SessionCreatedPayload extends QuizAnalyticsBase { };

export interface QuizQuestionAnsweredPayload extends QuizAnalyticsBase {
    questionId: string;
    answer: string;
};

export type QuizStarted = {
    eventName: typeof PerfumeEventsName.QUIZ_STARTED;
    payload: QuizStartedPayload;
}

export type QuizQuestionAnswered = {
    eventName: typeof PerfumeEventsName.QUESTION_ANSWERED;
    payload: QuizQuestionAnsweredPayload;
}

export type SessionCreated = {
    eventName: typeof PerfumeEventsName.SESSION_CREATED;
    payload: SessionCreatedPayload;
}

export type QuizAnalyticsPayload = QuizStartedPayload | QuizQuestionAnsweredPayload | SessionCreatedPayload;

export type QuizAnalyticsEvent = QuizStarted | QuizQuestionAnswered | SessionCreated;