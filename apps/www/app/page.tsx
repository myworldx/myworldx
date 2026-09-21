import { siteConfig } from '@/lib/config'

const EXTENSIONS = [
  { name: 'notes.blog', description: 'Dated entries, newest first' },
  { name: 'me.index', description: 'The profile root' },
  { name: 'sidegig.project', description: 'A project write-up' },
  { name: 'thought.post', description: 'A single standalone page' },
]

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Your repositories, rendered</h1>
        <p className="max-w-[60ch] text-lg text-pretty text-muted-foreground">{siteConfig.description}</p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Repository naming</h2>
        <p className="max-w-[60ch] text-pretty">
          A repository&apos;s name carries an extension that decides what kind of node it becomes. Its folders and
          markdown files become the page tree underneath.
        </p>
        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {EXTENSIONS.map(({ name, description }) => (
            <li key={name} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4">
              <code className="font-mono text-sm text-primary">{name}</code>
              <span className="text-sm text-muted-foreground">{description}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
