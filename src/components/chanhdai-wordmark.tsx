export function ChanhDaiWordmark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 240 32"
      aria-hidden
      {...props}
    >
      <text
        x="0"
        y="22"
        fontSize="18"
        fontWeight="600"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        Prathamesh Kadam
      </text>
    </svg>
  )
}

export function getWordmarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 240 32"><text x="0" y="22" font-size="18" font-weight="600" font-family="system-ui, sans-serif" fill="currentColor" letter-spacing="-0.5">Prathamesh Kadam</text></svg>`
}
