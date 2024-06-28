import Image from "next/image"

type EmptyProps = {
  src: string
  alt?: string
  header: string
  description?: string
  children?: React.ReactNode
}

export function Empty({ src, alt, header, description, children }: EmptyProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src={src}
        width={140}
        height={140}
        alt={alt || "alternative empty image"}
      />
      <h2 className="text-2xl font-semibold mt-6">{header}</h2>
      {description && (
        <p className="text-muted-foreground text-sm mt-2">{description}</p>
      )}
      {children}
    </div>
  )
}
