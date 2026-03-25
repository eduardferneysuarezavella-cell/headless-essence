interface PerfumeGuideFormProps {
    children: React.ReactNode;
    route?: string;
    action: keyof typeof PerfumeGuideForm.ACTIONS;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function PerfumeGuideForm({ children, route = '/parfymguiee', action }: PerfumeGuideFormProps) {

    return (
        <form method="POST" action={route} className="w-full">
            <input
                type="hidden"
                name="perfumeGuideInput"
                value={JSON.stringify({ action, sessionId: 'TEST' })}
            />

            {children}

        </form>
    )
}

export namespace PerfumeGuideForm {
    export const ACTIONS = {
        CreateSession: "CreateSession",
        SaveAnswer: "SaveAnswer",
    } as const;

    export interface QuizFormData {
        action: keyof typeof PerfumeGuideForm.ACTIONS;
        sessionId?: string;
    }

    export const getFormInput = (formData: FormData): QuizFormData => {
        const perfumeGuideInput = formData.get('perfumeGuideInput')?.toString();
        
        if (!perfumeGuideInput) {
            throw new Error('No form data provided');
        }

        const parsed = JSON.parse(perfumeGuideInput) as QuizFormData;

        return {
            action: parsed.action as keyof typeof PerfumeGuideForm.ACTIONS,
            sessionId: parsed.sessionId
        };
    };
}