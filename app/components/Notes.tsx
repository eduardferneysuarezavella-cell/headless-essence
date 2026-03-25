import { useMemo } from "react";
import { useTranslation } from "~/i18n/i18n";

interface NotesProps {
    topNotes: { value: string } | null | undefined;
    baseNotes: { value: string } | null | undefined;
    heartNotes: { value: string } | null | undefined;
    family: { value: string } | null | undefined;
}

export const Notes = ({ topNotes, baseNotes, heartNotes, family }: NotesProps) => {
    const { t: _ } = useTranslation();
    const parsedValues = useMemo(() => {
        return [topNotes, heartNotes, baseNotes, family].map((note) => {
            if (note === null || note === undefined) return [];
            return [...(JSON.parse(note.value) as Array<string>)];
        });
    }, [topNotes, heartNotes, baseNotes, family]);

    const isAnyFilled = parsedValues.some((value) => value.length > 0);

    return isAnyFilled ? (
        <div className="grid grid-cols-3 lg:grid-cols-4 pt-5 px-5 lg:gap-16 gap-4">
            {parsedValues[0].length > 0 && (
                <div className="flex flex-col flex-1">
                    <div className="flex justify-center mb-2">
                        <img src="https://cdn.shopify.com/s/files/1/0551/4611/9308/files/Toppnoter_ikon.png" alt="heart" className="w-10 h-auto" />
                    </div>
                    <h3 className="text-base font-heading text-center uppercase mb-2">{_('product.notes.topNotes')}</h3>

                    {parsedValues[0].map((note) => (
                        <span key={note} className="text-sm text-censter">{note}</span>
                    ))}
                </div>
            )}

            {parsedValues[1].length > 0 && (
                <div className="flex flex-col flex-1">
                    <div className="flex justify-center mb-2">
                        <img src="https://cdn.shopify.com/s/files/1/0551/4611/9308/files/Hj_rtnoter_ikon.png" alt="heart" className="w-10 h-auto" />
                    </div>
                    <h3 className="text-base font-heading text-center uppercase mb-2">{_('product.notes.heartNotes')}</h3>

                    {parsedValues[1].map((note) => (
                        <span key={note} className="text-sm text-center">{note}</span>
                    ))}
                </div>
            )}

            {parsedValues[2].length > 0 && (
                <div className="flex flex-col flex-1">
                    <div className="flex justify-center mb-2">
                        <img src="https://cdn.shopify.com/s/files/1/0551/4611/9308/files/Basnoter_ikon.png" alt="heart" className="w-10 h-auto" />
                    </div>
                    <h3 className="text-base font-heading text-center uppercase mb-2">{_('product.notes.baseNotes')}</h3>

                    {parsedValues[2].map((note) => (
                        <span key={note} className="text-sm text-center">{note}</span>
                    ))}
                </div>
            )}

            {parsedValues[3].length > 0 && (
                <div className="lg:flex flex-col flex-1 hidden">
                    <div className="flex justify-center mb-2">
                        <img src="https://cdn.shopify.com/s/files/1/0551/4611/9308/files/Doftgrupp_ikon.png" alt="heart" className="w-10 h-auto" />
                    </div>
                    <h3 className="text-base font-heading text-center uppercase mb-2">{_('product.notes.family')}</h3>

                    {parsedValues[3].map((note) => (
                        <span key={note} className="text-sm text-center">{note}</span>
                    ))}
                </div>
            )}
        </div>
    ) : null;
}