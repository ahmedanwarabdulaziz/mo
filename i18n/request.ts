import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'ar'];

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Validate that the incoming `locale` parameter is valid
    // Simplified for now, fallback to en
    if (!locale || !locales.includes(locale)) {
        locale = 'en';
    }

    let messages;
    try {
        // Messages are now inside i18n/messages
        messages = (await import(`./messages/${locale}.json`)).default;
    } catch (error) {
        // Fallback to English if the locale file fails to load
        messages = (await import(`./messages/en.json`)).default;
    }

    return {
        locale,
        messages
    };
});
