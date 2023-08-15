import Link from 'next/link'

export const MainMenu = () => {
  const array = ['Home', 'Blog', 'About', 'Contact']
  return (
    <nav className="flex h-8 w-full items-center justify-center p-8 text-lg font-normal">
      <ul className="flex h-full w-full items-center justify-between gap-3">
        {array.map((item) => (
          <li className="max-ful">
            <Link href={`/${item}`}>
              <span>{item}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
