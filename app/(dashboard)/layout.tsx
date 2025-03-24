import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import AuthProvider from "../providers/auth";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "sonner";
import { SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";

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
      <html lang="en" className="h-full">
        <body className={`${inter.className} h-full`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <AppSidebar />
              {children}

              <Toaster />
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
