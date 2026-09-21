---
"@myworldx/eslint-config": minor
---

Add a `./react-internal` export for packages that use React, layering
eslint-plugin-react and eslint-plugin-react-hooks over `./base` with the JSX
runtime rules that the new JSX transform makes unnecessary turned off.

Held back from the ESLint 9 rebuild because nothing in the repository used
React; `@myworldx/ui` is its first consumer.
