export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { FloatingNav } from "../components/ui/floating-navbar";
import { navItemsHome } from "../data";
import { Toaster } from "sonner";
import { getProjects } from "../data_access/get-projects";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lucas Sousa Portfólio",
  description: "Moderno e Minimalista Lucas Sousa Portfólio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projects = await getProjects({
    data: {},
    limit: 4,
  });

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="relative mx-auto flex flex-col items-center justify-center overflow-clip bg-black-100 px-5 sm:px-10">
            <div className="w-full max-w-7xl">
              <FloatingNav navItemsHome={navItemsHome} projects={projects} />

              {children}
              <Toaster />
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
