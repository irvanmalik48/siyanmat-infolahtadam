import Header from "@/components/Header";
import { PageMetadata } from "../types/types";
import RootLayout from "./RootLayout";

export default function LoginLayout(props: PageMetadata) {
  return (
    <RootLayout
      title={props.title}
      description={props.description}
      keywords={props.keywords}
      image={props.image}
      canonical={props.canonical}
    >
      <Header />
      {props.children}
    </RootLayout>
  )
}