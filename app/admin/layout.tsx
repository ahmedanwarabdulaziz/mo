import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css"; // Go up one level to app/globals.css
import AdminShell from "@/components/admin/admin-shell";

const geistSans = localFont({
    src: "../fonts/GeistVF.woff", // Adjust path
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff", // Adjust path
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
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
                <AdminShell>{children}</AdminShell>
            </body>
        </html>
    );
}
