# myworldx

Turborepo monorepo. GitHub repositories are the content source: a repository's
name carries an extension (`notes.blog`, `me.index`) that decides what kind of
node it becomes, and its file tree becomes the page tree.

`apps/www` is the Next.js site. `packages/*` are published to npm under the
`@myworldx` scope.

## State of the migration

The project is being rebuilt on the architecture of the sibling `rafer.dev`
repository — Next 16, React 19, Tailwind v4, shadcn on Base UI, and a
folder-driven content engine. Phases land one per pull request:

0. Toolchain parity — pnpm 10, Node 24, Turbo 2, Vitest, commitlint
1. `packages/ui` — the shadcn design system
2. `apps/www` — the app shell, which currently does not build
3. The content engine, refactored behind a `ContentSource` interface
4. The GitHub `ContentSource` — the part with no equivalent to copy
5. Multi-tenant routing by subdomain and `[user]`
6. CI parity — code checks, tests, signed commits

`apps/www` is not buildable yet. It holds two files that import modules which
do not exist; phase 2 replaces them.

## Toolchain

Node 24 (`.nvmrc`), pnpm 10, enforced by `engines`. pnpm 10 does not run
dependency build scripts unless they are listed under `allowBuilds` in
`pnpm-workspace.yaml`.

## Before saying work is done

Run all five. Report failures with their output rather than describing the
change as finished.

```
pnpm lint
pnpm typecheck
pnpm test
pnpm format:check
pnpm build
```

## ESLint

`@myworldx/eslint-config` is ESLint 9 flat config and exports `./base`, for
plain TypeScript packages. Each package holds an `eslint.config.mjs` that
re-exports it — `.mjs` because the packages are not `type: module` and a flat
config must load as ESM.

`next-js` and `react-internal` variants are deliberately absent. Nothing here
is React yet; they arrive with `packages/ui` and `apps/www` rather than sitting
unused and pulling plugins for frameworks the repo does not have.

## Code style

- **Do not write comments.** Name things so the code explains itself. The
  exceptions are a license header, an `// eslint-disable` with a stated reason,
  and a link to an external issue that explains a workaround which would
  otherwise look like a mistake.
- Put explanation in the commit message and the pull request body, not in the
  source.
- Prettier owns formatting: no semicolons, single quotes, 120 columns. Imports
  are sorted by `@ianvs/prettier-plugin-sort-imports` — do not hand-order them.
- `lint` never mutates. Use `pnpm lint:fix` when you want fixes applied.
- Match the surrounding file. Do not reformat code you are not changing.

## Commits

Conventional Commits, enforced by commitlint in the `commit-msg` hook. See
`.gitmessage` for the format.

**Never add `Co-Authored-By` or "Generated with" trailers.**

Hooks live in `.husky/` and run through husky v9 — plain shell scripts with no
`_/husky.sh` shim line, which fails in husky v10. `prepare-commit-msg` probes
`/dev/tty` in a subshell before handing over to commitizen, because a failed
`exec` redirect terminates a POSIX shell and would abort every non-interactive
commit.

## Packages

Published under `@myworldx`. Their `main` fields point into `dist/`, which tsup
only emits at build time, so anything that publishes must build first —
`ci:publish` is `pnpm build:packages && changeset publish` for that reason.

Directory names and package names deliberately differ: `packages/config-eslint`
publishes as `@myworldx/eslint-config`. Renaming the published names would
break consumers; leave them alone.

## Branches and pull requests

**One feature, one branch, one pull request.** Open a pull request for each new
piece of work rather than adding it to an existing branch, and name the branch
after what it contains. A branch that outlives its original purpose gets
renamed or replaced — never keep using a name that no longer describes the
change.

Branch from `canary`, which is the default branch; `stable` is the release
branch and the only one that deploys to production or publishes packages.

**Check the branch is current before writing any code.** Not once per session —
at the start of every new piece of work, because earlier pull requests get
merged while a session is still open.

```
git fetch origin
git status -sb
git log --oneline origin/canary..HEAD
```

Then:

- Behind `origin/canary`? Rebase onto it before starting.
- On a branch whose pull request is already merged? Do not keep committing to
  it. Pushing recreates a branch GitHub deleted at merge. Start a new branch
  from the freshened `origin/canary`.
- Commits that look unmerged but whose content is already on `canary`? The pull
  request was squash-merged. Rebase onto `origin/canary` and drop them, rather
  than opening a pull request that re-applies merged work.

Merge order matters here. Pull request #4 was cut from `canary` before #3
landed, so merging it silently reverted three fixes from #3. Rebase before
opening a pull request when another is already in flight.
