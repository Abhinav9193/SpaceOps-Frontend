import type { Metadata } from "next";
import "./globals.css";
import StarfieldBackground from "@/components/StarfieldBackground";
import FloatingPlanets from "@/components/FloatingPlanets";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "🌌 SpaceOps – Interactive Space Explorer",
  description: "Explore the wonders of space through stunning imagery, latest news, and community features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StarfieldBackground />
        <FloatingPlanets />
        <Navbar />
        <main className="min-h-screen pt-24 px-4 md:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
