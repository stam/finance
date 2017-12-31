import i18next from 'i18next';
import translationEn from './en';

i18next.init({
    lng: 'en',
    resources: {
        en: {
            translation: translationEn,
        },
    },
    interpolation: {
        // Not necessary for React, since it doesn't allow parsing HTML in strings.
        escapeValue: false,
    },
});

export const t = i18next.t.bind(i18next);
