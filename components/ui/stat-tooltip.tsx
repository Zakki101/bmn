import { ReactNode } from "react"

interface StatTooltipProps {
  children: ReactNode
  titlebarang: string
  baikValue: number
  perbaikanValue: number
}

export const StatTooltip = ({
  children,
  titlebarang,
  baikValue,
  perbaikanValue,
}: StatTooltipProps) => {
  const tooltipClassName = `absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-[12px] px-3 py-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 backdrop-blur-sm shadow-lg
  after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2
  after:border-4 after:border-transparent after:border-t-gray-800`

  return (
    <>
      {children}
      <div className={tooltipClassName}>
        <div className="font-semibold mb-1">{titlebarang}</div>
        <div className="flex justify-between gap-4">
          <span>Baik: {baikValue}</span>
          <span>Perbaikan: {perbaikanValue}</span>
        </div>
      </div>
    </>
  )
}
