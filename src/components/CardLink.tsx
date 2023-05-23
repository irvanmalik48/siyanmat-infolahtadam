import Link, { type LinkProps } from "next/link";

export default function CardLink(props: LinkProps & React.RefAttributes<HTMLAnchorElement> & {
  className?: string,
  icon: any,
  title: string,
  description: string,
}) {
  return (
    <Link
      {...props}
      className={
        `block md:max-w-xs overflow-clip bg-tni-darker rounded-xl text-white hover:bg-tni-accented transition ${props.className}`
      }
    >
      <div className="w-full px-5 py-3 bg-tni-dark">
        {props.icon}
      </div>
      <h1 className="px-5 pt-3 pb-2 text-lg font-bold truncate">
        {props.title}
      </h1>
      <p className="px-5 pb-3 text-sm max-w-fit">
        {props.description}
      </p>
    </Link>
  )
}