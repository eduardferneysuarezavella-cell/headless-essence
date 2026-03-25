import { useState, useContext, createContext } from 'react';
import { PerfumeEventsName, QuizAnalyticsEvent, QuizAnalyticsPayload, QuizEventType } from './analytic-types';

type PerfumeEventsContextType = {
    on: (eventName: QuizEventType, callback: (...args: any[]) => void) => void;
    off: (eventName: QuizEventType, callback: (...args: any[]) => void) => void;
    trigger: (eventName: QuizEventType, ...args: any[]) => void;
}

const PerfumeEventsContext = createContext<PerfumeEventsContextType | null>(null);

export const usePerfumeEvents = () => {
    const context = useContext(PerfumeEventsContext);

    if (!context) {
        throw new Error('usePerfumeEvents must be used within a PerfumeEventsProvider');
    }

    return context;
};

export type PerfumeEvents = {
    on: (eventName: QuizEventType, callback: (...args: any[]) => void) => void;
    off: (eventName: QuizEventType, callback: (...args: any[]) => void) => void;
    trigger: (eventName: QuizEventType, ...args: any[]) => void;
}

 

export function sendQuizAnalytics(
    event: QuizAnalyticsEvent
): Promise<void> {    
    const { eventName, payload } = event;

    let events: QuizAnalyticsEvent[] = [];

    if (eventName === PerfumeEventsName.QUIZ_STARTED) {
        events = events.concat([
            {
                eventName: PerfumeEventsName.SESSION_CREATED,
                payload: {
                    sessionId: payload.sessionId,
                }
            },
            event
        ])
    };

    if (events.length) {
        return sendToDatabase(events);
    } else {
        return Promise.resolve();
    }
};

function sendToDatabase(
    events: QuizAnalyticsEvent[]
): Promise<void> {
    console.log('Sending to database', events);

    return Promise.resolve();
}
