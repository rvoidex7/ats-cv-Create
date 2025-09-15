import React, { createContext, useState, useEffect, ReactNode } from 'react';
import en_US from '@/localizations/en_US';
import tr_TR from '@/localizations/tr_TR';
import { Localization } from '@/types';

export const LOCALIZATION_KEY = 'locale';

export interface LocalizationContextType {
    locale: string;
    setLocalization: (locale: string) => void;
    localization: Localization;
}

export const LocalizationContext = createContext<LocalizationContextType>({
    locale: 'en-US',
    setLocalization: () => { },
    localization: {} as Localization,
});

interface LocalizationProviderProps {
    children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
    const getInitialLocale = (): string => {
        const stored = localStorage.getItem(LOCALIZATION_KEY);
        if (stored) return stored;
        return navigator.language;
    };

    const [locale, setLocale] = useState<string>(getInitialLocale);

    useEffect(() => {
        localStorage.setItem(LOCALIZATION_KEY, locale);
    }, [locale]);

    const setLocalization = (newLocale: string) => {
        setLocale(newLocale);
    };

    const getData = (loc: string): Localization => {
        switch (loc) {
            case 'tr-TR':
                return tr_TR;
            case 'en-US':
            default:
                return en_US;
        }
    };

    return (
        <LocalizationContext.Provider
            value={{
                locale,
                setLocalization,
                localization: getData(locale),
            }}
        >
            {children}
        </LocalizationContext.Provider>
    );
};
