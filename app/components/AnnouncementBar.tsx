import { Link } from "@remix-run/react";
import { useCallback } from "react";
import { AnnouncementBarQuery } from "storefrontapi.generated";

export const AnnouncementBar = ({ metaobject }: AnnouncementBarQuery) => {
    const getField = useCallback((key: string) => {
        return metaobject?.fields.find((field: any) => field.key === key)?.value;
    }, [metaobject]);

    const isActive = getField('status') === 'true';

    //console.log(getField('text'), isActive, metaobject?.fields);

    if (!isActive) return null;

    const announcementBarLink = JSON.parse(getField('link') || '{}') as { url: string, text: string };
    const AnnouncementBarType = announcementBarLink?.url ? Link : 'div';

    return (
        <AnnouncementBarType to={announcementBarLink?.url || ''} className="flex justify-center items-center bg-black text-white font-heading text-center h-9 ">
            <div className="translate-y-0.5">{getField('text')}</div>
        </AnnouncementBarType>
    )
}