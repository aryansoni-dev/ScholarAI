import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { clerkDarkAppearance } from "@/lib/clerk-appearance";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScholarAI – Your Intelligent Study Assistant",
  description:
    "Upload your study materials and get AI-powered Q&A, summaries, quizzes, and flashcards instantly.",
  keywords: ["study assistant", "AI", "flashcards", "quiz", "PDF", "notes"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkDarkAppearance}>
      <html lang="en" className="dark">
        <body
          className={`${inter.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>
            {children}
            <Toaster />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
