import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import AuthProvider from "../providers/auth";
import { ThemeProvider } from "../components/theme-provider";
import { SidebarDemo } from "./dashboard/components/SidebarDemo";
import { cn } from "../lib/utils";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lucas Sousa Portfólio",
  description: "Moderno e Minimalista Lucas Sousa Portfólio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div
              className={cn(
                ":border-neutral-700 flex h-screen flex-1 flex-col overflow-hidden rounded-md border bg-neutral-800 md:flex-row",
              )}
            >
              <SidebarDemo />
              {children}

              <Toaster />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
