export function Tag({ children }: { children: string }) {
  return (
    <span className="border-ink border-[1.5px] px-1.5 py-0.5 font-(family-name:--f-mono) text-[10px] tracking-[.12em] whitespace-nowrap uppercase">
      {children}
    </span>
  )
}
