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

`pnpm lint` does not pass yet: no package has an ESLint config, and
`@myworldx/eslint-config` still targets Next, Tailwind and Storybook, none of
which are present. Splitting it into `base` / `next-js` / `react-internal` is
the next piece of work.

## Code style

- Prettier owns formatting: no semicolons, single quotes, 120 columns. Imports
  are sorted by `@ianvs/prettier-plugin-sort-imports` — do not hand-order them.
- `lint` never mutates. Use `pnpm lint:fix` when you want fixes applied.
- Match the surrounding file. Do not reformat code you are not changing.

## Commits

Conventional Commits, enforced by commitlint in the `commit-msg` hook. See
`.gitmessage` for the format.

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

One phase, one branch, one pull request. Branch from `canary`, which is the
default branch; `stable` is the release branch and the only one that deploys to
production or publishes packages.

Check the branch is current before writing code — not once per session, but at
the start of each piece of work, because earlier pull requests get merged while
a session is still open.

```
git fetch origin
git log --oneline origin/canary..HEAD
```
