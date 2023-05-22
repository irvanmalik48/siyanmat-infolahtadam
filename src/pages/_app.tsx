import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Inter, Playfair_Display } from 'next/font/google';
import { trpc } from "../common/trpc";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

interface CustomAppProps extends AppProps {
  pageProps: {
    session?: Session;
  } & AppProps["pageProps"];
}

function App({ Component, pageProps }: CustomAppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <main id="finject" className={`${inter.variable} ${playfair.variable}`}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}

export default trpc.withTRPC(App);