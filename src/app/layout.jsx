import { League_Spartan } from "next/font/google";
import "./globals.css";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

export const metadata = {
  title: "Calculator App - Modern, Accessible Calculator",
  description:
    "A modern, accessible calculator with multiple themes, keyboard support, and full WCAG 2.1 AA compliance. Perform basic arithmetic operations with ease.",
  keywords: [
    "calculator",
    "accessible calculator",
    "online calculator",
    "math",
    "arithmetic",
  ],
  authors: [{ name: "Alice Temitope Abiola" }],
  alternates: {
    canonical: "https://your-domain.com/calculator",
  },
  openGraph: {
    title: "Calculator App - Modern & Accessible",
    description:
      "A beautiful, accessible calculator with dark mode and keyboard shortcuts",
    type: "website",
    url: "https://your-domain.com/calculator",
    siteName: "Calculator App",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculator App",
    description: "A beautiful, accessible calculator with dark mode.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={leagueSpartan.className}>
        <a
          href="#calculator-main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
        >
          Skip to calculator
        </a>
        {children}
      </body>
    </html>
  );
}
