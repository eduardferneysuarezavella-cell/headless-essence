import { useMatches } from "@remix-run/react";
import { ReactNode } from "react";

export function useLocale() {
    const [root] = useMatches();

    if (!root.data || !(root.data as any).i18n) {
        throw new Error(
            'i18n was not returned from the root layout loader.\n Please make sure i18n is configured correctly in both server.ts and root.tsx.',
        );
    }

    return (root.data as any).i18n;
}

type Translation = {
    t: (key: string, interpolations?: Record<string, number | string | ((value: string) => ReactNode)>) => React.ReactNode | string;
    translation: Record<string, string> | null;
}

export function useTranslation(): Translation {
    const { locale: { language }, translations } = useLocale();


    // we have to safeguard against a particular language translation
    // missing, as it's possible to have a language json without a
    // translation key if the user miss types it or removes it
    if (!language) {
        return { t: (key: string) => key, translation: null };
    }

    if (!translations.translation) {
        // translation not found for this key and language
        return { t: (key: string) => key, translation: null };
    }


    function t(key?: string, interpolations?: Record<string, number | string | ((value: string) => ReactNode)>): React.ReactNode | string {
        const keys = key?.split('.') ?? [];

        if (typeof translations.translation === 'undefined') {
            return key ?? '';
        }

        if (keys.length === 1) {
            if (keys[0] in translations.translation) {
                const _key = keys[0];
                const segmentIsString = typeof translations.translation[_key] === 'string';

                if (segmentIsString) {
                    if (!interpolations) {
                        return translations.translation[_key];
                    }

                    return interpolate(translations.translation[_key], interpolations ?? {});
                } else {
                    return '';
                }
            } else {
                return key ?? '';
            }
        } else if (keys.length > 1) {
            const value = getValue(translations.translation, key) ?? '';
            if (typeof value === 'string') {
                if (!interpolations) {
                    return value;
                }

                return interpolate(value, interpolations ?? {});
            }
            return key as string;
        } else {
            return key ?? '';
        }
    }

    return { t, translation: translations.translation };
}

function interpolate(string: string, interpolations: Record<string, string | number | ((value: string) => ReactNode)>): React.ReactNode {
    const processedString = string.replace(/\\n/g, '\n');

    return interpolateCustomTags(string.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        const replacement = interpolations[key];
        if (typeof replacement === 'function') {
            return match; // Keep the original match if it's a function
        }

        return String(replacement) ?? match;
    }), interpolations);
}

function interpolateCustomTags(
    text: string,
    tagMap: Record<string, number | string | ((value: string) => React.ReactNode)>
): React.ReactNode {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    Object.entries(tagMap).forEach(([tag, replacement]) => {
        const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, 'g');
        let match;

        while ((match = regex.exec(text)) !== null) {
            const [fullMatch, content] = match;
            const startIndex = match.index;
            const endIndex = regex.lastIndex;

            // Push text before the match
            if (lastIndex < startIndex) {
                parts.push(text.slice(lastIndex, startIndex));
            }

            // Push the replacement
            if (typeof replacement === 'function') {
                parts.push(replacement(content));
            } else {
                parts.push(String(replacement).replace('$1', content));
            }

            lastIndex = endIndex;
        }
    });

    // Push remaining text after the last match
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return <>{parts}</>;
}

function getValue(obj: object, key: string | undefined) {
    if (!key) return null

    const keys = key.split('.');
    let value = obj;

    for (let i = 0; i < keys.length; i++) {
        // @ts-ignore
        value = value[keys[i]];

        if (!value) {
            break;
        }
    }
    return value;
}