import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

type ToolButtonProps = {
  label: string
  icon: LucideIcon
  onClick: () => void
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
        disabled={isDisabled}
        size="icon"
        onClick={onClick}
        variant={isActive ? "boardActive" : "board"}
      >
        <Icon />
      </Button>
    </Hint>
  )
}
