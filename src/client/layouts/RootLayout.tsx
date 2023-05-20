import { Helmet } from "react-helmet-async";
import { PageMetadata } from "../types/types";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

export default function RootLayout(props: PageMetadata) {
  const location = useLocation();

  return (
    <>
      <Helmet prioritizeSeoTags>
        <meta charSet="utf-8" />
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
        <link rel="canonical" href={`${import.meta.env.VITE_PRODUCTION ? "http://localhost:5173" : import.meta.env.VITE_PROD_SITE_URL}${location.pathname}`} />
        {props.keywords && <meta name="keywords" content={props.keywords.join(", ")} />}
        {props.image && <meta name="image" content={props.image} />}
      </Helmet>
      <main id="main-layout" className="w-full bg-white">
        {props.children}
        <Footer />
      </main>
    </>
  )
}