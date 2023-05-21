export default function TableSection(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  tableClassName?: string,
  wrapperClassName?: string,
}) {
  return (
    <section id="table" className={`w-full my-5 rounded-xl overflow-clip ${props.className}`}>
      <div className={`w-full overflow-x-scroll ${props.wrapperClassName}`}>
        <table className={`w-full border-separate table-auto overflow-clip border-spacing-0 rounded-xl ${props.tableClassName}`}>
          {props.children}
        </table>
      </div>
    </section>
  )
}