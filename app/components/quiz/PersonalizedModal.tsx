import { Dialog, DialogPanel } from "@headlessui/react";
import { Form, useFetcher } from "@remix-run/react";
import { useState } from "react"
import { Answers } from "~/data/questions";
import { useTranslation } from "~/i18n/i18n";

export const PersonalizedModal = ({ answers }: { answers: Answers }) => {
    const fetcher = useFetcher();
    const { t: _ } = useTranslation();
    const [open, setOpen] = useState<boolean>(false);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        console.log(answers);

        fetcher.submit(
            { 
                likedPerfumes: formData.get('likedPerfumes')?.toString() ?? '', 
                dislikedPerfumes: formData.get('dislikedPerfumes')?.toString() ?? '', 
                other: formData.get('other')?.toString() ?? '', 
                email: formData.get('email')?.toString() ?? '',
                answers: JSON.stringify(answers)
            },
            { method: 'POST', action: '/api/personalized-answer', }
        );
    }

    return (
        <>
            <div className="pb-4 pt-8">
                <button
                    onClick={() => setOpen(true)}
                    className="flex flex-col items-center justify-center cursor-pointer border border-black min-w-[300px] active:bg-black active:text-white md:hover:bg-black md:hover:text-white transition-all text-sm uppercase py-1"
                >
                    {_('quiz.personalAnswer')}
                </button>
            </div>

            <Dialog open={open} onClose={setOpen}>
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <DialogPanel className='space-y-4 border border-black bg-white p-8 md:min-w-[600px]'>
                        <h2 className="font-heading text-3xl text-center">Få ett personligt svar 💌</h2>

                        <fetcher.Form   
                            onSubmit={onSubmit}
                            className="flex flex-col justify-center items-center w-full space-y-4"
                            
                        >
                            <fieldset className="w-full space-y-2">
                                <textarea
                                    name="likedPerfumes"
                                    typeof="text"
                                    placeholder="Vilken parfymer gillar du?"
                                    className="w-full border border-neutral-300 p-2"
                                />

                                <textarea
                                    name="dislikedPerfumes"
                                    typeof="text"
                                    placeholder="Vilken parfymer gillar du inte?"
                                    className="w-full border border-neutral-300 p-2"
                                />

                                <textarea
                                    name="other"
                                    typeof="text"
                                    placeholder="Övrigt"
                                    className="w-full border border-neutral-300 p-2"
                                />

                                <input
                                    name="email"
                                    typeof="email"
                                    placeholder="Din e-postadress"
                                    className="w-full border border-neutral-300 p-2"
                                />
                            </fieldset>

                            <button
                                type="submit"
                                className="flex flex-col items-center justify-center cursor-pointer border border-black min-w-[300px] active:bg-black active:text-white md:hover:bg-black md:hover:text-white transition-all text-sm py-1"
                            >
                                Skicka in
                            </button>
                        </fetcher.Form>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}