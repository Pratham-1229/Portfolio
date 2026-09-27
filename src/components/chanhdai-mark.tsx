// Crisp pixel-art outline path for PK, matching the 64px grid density.
// Center waist of K is slimmed to reduce visual bulk in the center.
const PK_PATH =
  "M0 0H192V64H256V128H192V192H64V256H0V0ZM64 64H192V128H64V64ZM320 0H384V256H320V0ZM384 64H448V192H384V64ZM448 0H576V64H448V0ZM448 192H576V256H448V192Z"

export function ChanhDaiMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 576 256"
      aria-hidden
      {...props}
    >
      <path d={PK_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}

export function getMarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 576 256"><path d="${PK_PATH}" fill="currentColor" fill-rule="evenodd"/></svg>`
}
