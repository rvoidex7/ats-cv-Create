import { LocalizationContext, LocalizationContextType } from '@/context/LocalizationContext';
import { useContext } from 'react';

export const useLocalization = () => {
    const context: LocalizationContextType = useContext(LocalizationContext);

    if (!context) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }

    return context;
};
