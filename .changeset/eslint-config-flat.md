---
"@myworldx/eslint-config": minor
---

Rebuild on ESLint 9 flat config and expose the shared config as a named
`./base` export instead of the package root.

The previous entry point wrapped an eslintrc object in `FlatCompat` and
extended Next, Storybook and Tailwind presets, pointing at an
`apps/www/tailwind.config.cjs` that does not exist. It also imported
`@eslint/eslintrc` without declaring it, so the config could not load in a
clean install.

Consumers now import it explicitly:

```js
import { config } from '@myworldx/eslint-config/base'

export default config
```

`next-js` and `react-internal` variants will be added alongside the packages
that need them.
