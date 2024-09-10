import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

import { SessionProvider } from "next-auth/react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <Header />
      {children}
      <Footer />
    </SessionProvider>
  );
}
