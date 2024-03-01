import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import QueryClientProviderWrapper from "@/providers/query-client-provider-wrapper";
import ConfirmModalProvider from "@/providers/confirm-modal-provider";
import { Toaster } from "@/components/ui/sonner";
import InfoModalProvider from "@/providers/info-modal-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "ACE System",
    description: "Attendance Capturing and Election System",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.variable} ${inter.variable}`}>
                <QueryClientProviderWrapper>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                    >
                        <ConfirmModalProvider />
                        <InfoModalProvider />

                        <Toaster richColors closeButton />
                        <div className="font-inter">{children}</div>
                    </ThemeProvider>
                </QueryClientProviderWrapper>
            </body>
        </html>
    );
}
