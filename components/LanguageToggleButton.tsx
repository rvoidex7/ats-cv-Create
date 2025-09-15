import React from 'react';
import { useLocalization } from '@/hooks/useLocalization';

const LanguageToggleButton: React.FC = () => {
    const { locale, setLocalization, localization } = useLocalization();

    const toggleLanguage = () => {
        if (locale === 'tr-TR') {
            setLocalization('en-US');
        } else {
            setLocalization('tr-TR');
        }
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 sm:space-x-2 bg-gray-600 text-white font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            title={localization.ChangeLanguage}
        >
            {locale === 'tr-TR' ? 'TR' : 'EN'}
        </button>
    );
};

export default LanguageToggleButton;
