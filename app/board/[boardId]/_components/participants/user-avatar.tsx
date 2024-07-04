import { Hint } from "@/components/hint"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type UserAvatarProps = {
  src?: string
  name?: string
  fallback?: string
  borderColor?: string
}

export function UserAvatar({
  src,
  name,
  fallback,
  borderColor,
}: UserAvatarProps) {
  return (
    <Hint label={name || "Teammate"} side="bottom" sideOffset={18}>
      <Avatar className="h-8 w-8 border-2" style={{ borderColor }}>
        <AvatarImage src={src} />
        <AvatarFallback className="text-xl font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>
    </Hint>
  )
}
