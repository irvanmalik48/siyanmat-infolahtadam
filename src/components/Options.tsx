export function PeralatanOptions(props: { list: any[], defaultValue: string }) {
  return (
    <>
      <option value="">{props.defaultValue}</option>
      {props.list.map((obj) => (
        <option key={obj.id} value={obj.id}>{obj.namaPeralatan}</option>
      ))}
    </>
  )
}