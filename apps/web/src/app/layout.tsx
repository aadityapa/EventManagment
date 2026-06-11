import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Inter, Manrope, Montserrat, Playfair_Display, Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AdaptiveThemeProvider } from "@/components/adaptive/adaptive-theme-provider";
import { CinematicProvider } from "@/components/providers/cinematic-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { BrandHeader } from "@/brand/shell/brand-header";
import { BrandFooter } from "@/brand/shell/brand-footer";
import { BrandFab } from "@/brand/shell/brand-fab";
import { generateSEO, organizationSchema } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap" });
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"], display: "swap" });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], display: "swap" });
const poppins = Poppins({ variable: "--font-poppins", weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], display: "swap" });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", weight: ["400", "500", "600", "700"], subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  ...generateSEO(),
  icons: { icon: "/logo.jpg", apple: "/logo.jpg" },
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
  const schema = organizationSchema();
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </head>
      <body className={`${inter.variable} ${manrope.variable} ${playfair.variable} ${cinzel.variable} ${montserrat.variable} ${poppins.variable} ${cormorant.variable} brand-root brand-body min-h-screen flex flex-col antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="glitz-theme" disableTransitionOnChange={false}>
          <AdaptiveThemeProvider>
          <CinematicProvider>
            <BrandHeader />
            <main className="app-main flex-1 pb-20 md:pb-0">{children}</main>
            <BrandFooter />
            <BrandFab />
            <ToastProvider />
          </CinematicProvider>
          </AdaptiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
