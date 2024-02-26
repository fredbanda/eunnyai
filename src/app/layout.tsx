import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {ClerkProvider} from "@clerk/nextjs"

const IBMPlex = IBM_Plex_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  title: "EunnyAI | the future is now",
  description: "AI-Powered Image generator and editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{variables: {colorPrimary: '#624cf5'}}}>
      <html lang="en" suppressHydrationWarning>
          <body className={cn("font-IMBPlex antialiased", IBMPlex.variable)}>
            {children}
          </body>
      </html> 
    </ClerkProvider>

  );
}
