import { ThemeProvider } from "@/providers/theme-provider";
import QueryProvider from "@/providers/query-provider";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "iOnidev — John Mason, Full Stack Developer",
  description:
    "Full Stack Developer based in Port Harcourt, Nigeria. Ship less. Engineer more.",
  metadataBase: new URL("https://ionidev.com"),
  openGraph: {
    title: "iOnidev — John Mason",
    description: "Ship less. Engineer more.",
    url: "https://ionidev.com",
    siteName: "iOnidev",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <NextTopLoader color="var(--accent)" showSpinner={false} />
        <ThemeProvider>
          <QueryProvider>
            <main>{children}</main>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  fontSize: "14px",
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
