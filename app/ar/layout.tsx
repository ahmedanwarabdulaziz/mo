import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import localFont from "next/font/local";
import "../globals.css";

const geistSans = localFont({
    src: "../fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export default async function ArLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const messages = await getMessages({ locale: 'ar' });

    return (
        <html lang="ar" dir="rtl">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
                <NextIntlClientProvider messages={messages} locale="ar">
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
