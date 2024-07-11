import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import { MouseEvent } from "react"

type ToolButtonProps = {
  label: string
  icon: LucideIcon
  onClick: (e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void
  isActive?: boolean
  isDisabled?: boolean
}

export function ToolButton({
  label,
  icon,
  onClick,
  isActive,
  isDisabled,
}: ToolButtonProps) {
  const Icon = icon
  return (
    <Hint label={label} side="right" sideOffset={14}>
      <Button
        size="icon"
        disabled={isDisabled}
        onClick={onClick}
        variant={isActive ? "boardActive" : "board"}
      >
        <Icon />
      </Button>
    </Hint>
  )
}
