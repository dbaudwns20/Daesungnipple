import Footer from "@/components/footer";
import Header from "@/components/header";

import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function RootLayout(
  props: Readonly<{
    modal: React.ReactNode;
    children: React.ReactNode;
  }>,
) {
  const session = await auth();
  return (
    <>
      <Header session={session} />
      <SessionProvider>
        {props.children}
        {props.modal}
      </SessionProvider>
      <Footer />
    </>
  );
}
