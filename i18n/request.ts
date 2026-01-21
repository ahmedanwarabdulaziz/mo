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
    // Static imports to ensure bundling in Vercel Edge Runtime
    // This avoids "module not found" errors caused by dynamic variables in paths

    try {
        if (locale === 'ar') {
            messages = (await import('./messages/ar.json')).default;
        } else {
            messages = (await import('./messages/en.json')).default;
        }
    } catch (error) {
        console.error("Failed to load messages:", error);
        messages = (await import('./messages/en.json')).default;
    }

    return {
        locale,
        messages
    };
});
