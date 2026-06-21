import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Inter, Manrope, Montserrat, Playfair_Display, Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AdaptiveThemeProvider } from "@/components/adaptive/adaptive-theme-provider";
import { CinematicProvider } from "@/components/providers/cinematic-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { BrandHeader } from "@/brand/shell/brand-header";
import { BrandFooter } from "@/brand/shell/brand-footer";
import { BrandFab } from "@/brand/shell/brand-fab";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { SentryInit } from "@/components/monitoring/sentry-init";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { ExitIntentPopup } from "@/components/engagement/exit-intent-popup";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { generateSEO, organizationSchema, websiteSchema, entityDefinitionSchema } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap", preload: true });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap", preload: true });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap", preload: true });
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"], display: "swap" });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], display: "swap" });
const poppins = Poppins({ variable: "--font-poppins", weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], display: "swap" });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", weight: ["400", "500", "600", "700"], subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  ...generateSEO(),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/logo.jpg" }],
    apple: "/logo.jpg",
  },
  manifest: "/manifest.json",
  category: "Event Management",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFBF5" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const orgSchema = organizationSchema();
  const siteSchema = websiteSchema();
  const entitySchema = entityDefinitionSchema();
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entitySchema) }} />
      </head>
      <body className={`${inter.variable} ${manrope.variable} ${playfair.variable} ${cinzel.variable} ${montserrat.variable} ${poppins.variable} ${cormorant.variable} brand-root brand-body min-h-screen flex flex-col antialiased overflow-guard`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="glitz-theme" disableTransitionOnChange={false}>
          <SentryInit />
          <AnalyticsProvider />
          <AdaptiveThemeProvider>
          <CinematicProvider>
            <BrandHeader />
            <ErrorBoundary>
              <main id="main-content" className="app-main flex flex-1 flex-col pb-20 md:pb-0" tabIndex={-1}>
                {children}
              </main>
            </ErrorBoundary>
            <BrandFooter />
            <BrandFab />
            <CookieConsent />
            <ExitIntentPopup />
            <ToastProvider />
          </CinematicProvider>
          </AdaptiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
