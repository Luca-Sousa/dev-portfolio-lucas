import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { FloatingNav } from "../components/ui/floating-navbar";
import { navItemsHome } from "../data";

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
    <html lang="en">
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="relative bg-black-100 flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
            <div className="max-w-7xl w-full">
              <FloatingNav navItemsHome={navItemsHome} />

              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
