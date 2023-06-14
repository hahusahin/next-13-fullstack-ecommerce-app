import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Rubik } from "next/font/google";
import "./globals.css";
import ClientOnly from "@/components/ClientOnly";
import ToasterProvider from "@/providers/ToasterProvider";
import NextAuthSessionProvider from "@/providers/SessionProvider";
import ReduxProvider from "@/providers/ReduxProvider";

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
        <NextAuthSessionProvider>
          <ReduxProvider>
            <ClientOnly>
              <ToasterProvider />
            </ClientOnly>
            <main className="container flex flex-col justify-between items-center min-h-screen overflow-y-auto">
              <Header />
              {children}
              <Footer />
            </main>
          </ReduxProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
