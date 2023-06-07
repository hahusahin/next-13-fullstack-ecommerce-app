import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Rubik } from "next/font/google";
import "./globals.css";
import ClientOnly from "@/components/ClientOnly";
import ToasterProvider from "@/providers/ToasterProvider";
import ChakraProviders from "@/providers/ChakraProviders";
import NextAuthSessionProvider from "@/providers/SessionProvider";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "Ecomerce App",
  description: "Ecommerce App developed using Next 13",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${rubik.className} bg-slate-100`}>
        <ChakraProviders>
          <NextAuthSessionProvider>
            <ClientOnly>
              <ToasterProvider />
            </ClientOnly>
            <main className="flex flex-col justify-between h-screen">
              <div className="container">
                <Header />
                {children}
              </div>
              <Footer />
            </main>
          </NextAuthSessionProvider>
        </ChakraProviders>
      </body>
    </html>
  );
}
