import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import AdminShell from "@/components/admin/admin-shell";

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

export const metadata: Metadata = {
    title: "Admin Panel | MO3D",
    description: "MO3D Admin Dashboard",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Auth protection is handled by AdminShell component (client-side)
    // This provides better UX with redirects and maintains session state

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
                <AdminShell>{children}</AdminShell>
            </body>
        </html>
    );
}
