import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MO3D - Redirecting...',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
