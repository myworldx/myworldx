export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="mx-auto flex max-w-4xl flex-col px-8">{children}</body>
    </html>
  )
}
