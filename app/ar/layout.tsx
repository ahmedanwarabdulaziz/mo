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

export const metadata = {
    title: "MO3D - العربية",
    description: "تطبيق MO3D",
};

export default function ArLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
                {children}
            </body>
        </html>
    );
}
