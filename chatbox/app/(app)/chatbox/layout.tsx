// app/(app)/chatbox/layout.tsx
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full w-full">
      {children}
    </div>
  )
}
