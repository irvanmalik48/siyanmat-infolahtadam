import { PageMetadata } from "../types/types";
import Footer from "@/components/Footer";
import Head from "next/head";
import { useRouter } from "next/router";

export default function RootLayout(props: PageMetadata) {
  const location = useRouter();

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="canonical" href={`${process.env.PRODUCTION ? "http://localhost:3000" : process.env.PROD_SITE_URL}${location.pathname}`} />
        {props.keywords && <meta name="keywords" content={props.keywords.join(", ")} />}
        {props.image && <meta name="image" content={props.image} />}
      </Head>
      <main id="main-layout" className="w-full bg-white">
        {props.children}
        <Footer />
      </main>
    </>
  )
}