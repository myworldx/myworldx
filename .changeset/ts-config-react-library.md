---
"@myworldx/ts-config": minor
---

Modernise `react-library.json` for React 19. It targeted ES6 with an ES2015
library, which predates the language features the React 19 and Base UI type
definitions use, and resolved modules through the classic Node algorithm, which
cannot follow the subpath exports that `@myworldx/ui` publishes.

Now targets ES2022 with `DOM.Iterable` and resolves modules through `bundler`.
`base.json` is untouched, so the packages that extend it directly are
unaffected.
