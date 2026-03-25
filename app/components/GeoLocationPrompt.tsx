import { useEffect, useState } from 'react';
import { useMatches, useLocation } from '@remix-run/react';
import { AnimatePresence, motion } from 'framer-motion';
import { countries, type Locale } from '~/data/countries';

// Only map countries that have specific stores
const COUNTRY_CODE_TO_STORE: Record<string, string> = {
    'SE': 'se',
    'NO': 'no',
    'DK': 'dk',
    'FI': 'fi'
};

// Map country codes to display names
const COUNTRY_NAMES: Record<string, string> = {
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'FR': 'France',
    'DE': 'Germany',
    'GB': 'the United Kingdom',
    'US': 'the United States',
    'CA': 'Canada',
    'AU': 'Australia',
    'NZ': 'New Zealand',
    'IT': 'Italy',
    'ES': 'Spain',
    'PT': 'Portugal',
    'NL': 'the Netherlands',
    'BE': 'Belgium',
    'CH': 'Switzerland',
    'AT': 'Austria',
    'PL': 'Poland',
    'RO': 'Romania',
    'BG': 'Bulgaria',
    'GR': 'Greece',
    'CZ': 'Czech Republic',
    'HU': 'Hungary',
    'SK': 'Slovakia'
};

interface GeoLocationPromptProps {
    detectedCountry?: string | null;
}

export function GeoLocationPrompt({ detectedCountry }: GeoLocationPromptProps) {
    const [root] = useMatches();
    const location = useLocation();
    const { country } = location.state?.context ?? {};
    const [isOpen, setIsOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('geoPromptClosed') !== 'true';
        }
        return true;
    });
    const [showCountrySelector, setShowCountrySelector] = useState(false);
    const [userCountry, setUserCountry] = useState<string | null>(null);
    const [detectedCountryName, setDetectedCountryName] = useState<string | null>(null);
    const selectedLocale = (root.data as any).selectedLocale as Locale;

    useEffect(() => {
        detectUserCountry();

        function detectUserCountry() {
            // First try to use the country from location state
            if (country) {
                const suggestedCountry = COUNTRY_CODE_TO_STORE[country];
                if (suggestedCountry && countries[suggestedCountry]) {
                    setUserCountry(suggestedCountry);
                    setDetectedCountryName(country);
                    return;
                }
            }

            // Then try to use the detected country from IP
            if (detectedCountry) {
                const suggestedCountry = COUNTRY_CODE_TO_STORE[detectedCountry];
                if (suggestedCountry && countries[suggestedCountry]) {
                    // This is one of our specific country stores
                    setUserCountry(suggestedCountry);
                    setDetectedCountryName(detectedCountry);
                    return;
                } else {
                    // For all other countries, direct to global store
                    setUserCountry('global');
                    setDetectedCountryName(detectedCountry);
                    return;
                }
            }

            // Default to global if no country is detected
            setUserCountry('global');
            setDetectedCountryName(null);
        }
    }, [country, detectedCountry]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem('geoPromptClosed', 'true');
    };

    // Get country name for display
    const getCountryDisplayName = () => {
        if (!detectedCountryName) return 'abroad';
        return COUNTRY_NAMES[detectedCountryName] || detectedCountryName;
    };

    // Don't show if we don't have a country or if the user is already on the correct site
    if (!userCountry || userCountry === selectedLocale?.country?.toLowerCase()) return null;

    const suggestedLocale = countries[userCountry];
    if (!suggestedLocale) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
                >
                    {showCountrySelector ? (
                        <CountrySelector
                            onClose={handleClose}
                            onBack={() => setShowCountrySelector(false)}
                        />
                    ) : (
                        <CountryPrompt
                            detectedCountryName={detectedCountryName}
                            userCountry={userCountry}
                            suggestedLocale={suggestedLocale}
                            onClose={handleClose}
                            onSelectCountry={() => setShowCountrySelector(true)}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Extracted component for the country prompt
function CountryPrompt({
    detectedCountryName,
    userCountry,
    suggestedLocale,
    onClose,
    onSelectCountry
}: {
    detectedCountryName: string | null;
    userCountry: string;
    suggestedLocale: Locale;
    onClose: () => void;
    onSelectCountry: () => void;
}) {
    const countryName = !detectedCountryName ? 'abroad' :
        (COUNTRY_NAMES[detectedCountryName] || detectedCountryName);

    return (
        <div className="relative max-w-md w-full mx-4 bg-white border border-black p-8 max-h-[90vh] overflow-y-auto">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-black"
                aria-label="Close"
            >
                ✕
            </button>

            <div className="flex justify-center mb-4">
                <img
                    src={`https://cdn.shopify.com/static/images/flags/${detectedCountryName?.toLowerCase() || 'us'}.svg?width=26`}
                    alt=""
                    className="w-[26px]"
                />
            </div>

            <h2 className="text-center mb-2 text-lg">
                {`We notice you're visiting from ${countryName}`}
            </h2>

            <p className="text-center text-sm mb-6">
                {`Shop with ${suggestedLocale.currency}`}
            </p>

            <div className="flex flex-col gap-2">
                <a
                    href={suggestedLocale.host}
                    className="bg-[#000] text-white py-3 px-4 text-center"
                >
                    {userCountry === 'global'
                        ? 'Continue to our global store'
                        : `Continue to ${suggestedLocale.label}`}
                </a>
                <button
                    onClick={onSelectCountry}
                    className="text-black underline text-sm mt-2"
                >
                    Change country
                </button>
            </div>
        </div>
    );
}

// Extracted component for the country selector
function CountrySelector({
    onClose,
    onBack
}: {
    onClose: () => void;
    onBack: () => void;
}) {
    return (
        <div className="relative max-w-md w-full mx-4 bg-white border border-black p-8 max-h-[90vh] overflow-y-auto">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-black"
                aria-label="Close"
            >
                ✕
            </button>

            <h2 className="text-center mb-6 text-lg">
                Select your country
            </h2>

            <div className="grid gap-3">
                {Object.entries(countries).map(([key, locale]) => (
                    <a
                        key={key}
                        href={locale.host}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 border border-gray-200"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={`https://cdn.shopify.com/static/images/flags/${locale.country.toLowerCase() === 'fr' ? 'us' : locale.country.toLowerCase()}.svg?width=26`}
                                alt=""
                                className="w-[26px]"
                            />
                            <span>{locale.label}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                            {locale.currency}
                        </span>
                    </a>
                ))}
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={onBack}
                    className="px-6 py-2 text-sm border border-black hover:bg-gray-50"
                >
                    Back
                </button>
            </div>
        </div>
    );
} 