---
"@myworldx/ts-config": minor
---

Rebuild `nextjs.json` on `base.json` and modernise it for Next 16.

It previously declared its own compiler options from scratch rather than
extending the shared base, targeted ES5, and resolved modules through the
classic Node algorithm — which cannot follow the subpath exports that
`@myworldx/ui` publishes. Its `include` also referenced `src/env.ts` and
excluded `./src/instrumentation.ts`, paths from an app layout that no longer
exists.

Now extends `base.json` and targets ES2022 with `bundler` resolution.
