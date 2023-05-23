import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Inter, Playfair_Display } from 'next/font/google';
import { trpc } from "../common/trpc";

interface CustomAppProps extends AppProps {
  pageProps: {
    session?: Session;
  } & AppProps["pageProps"];
}

function App({ Component, pageProps }: CustomAppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default trpc.withTRPC(App);