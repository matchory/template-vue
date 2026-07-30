# CLAUDE.md

Guidance for Claude Code (and other coding agents) working in this repository.

## Stack

- Vite + Vue 3 + TypeScript, package-managed with pnpm 10.33.0
- Tailwind v4 via `@tailwindcss/vite`
- oxfmt for formatting, oxlint and ESLint for linting, both configured via `matchory/coding-style`
- Vitest and `@vue/test-utils` for tests
- `vue-tsc` for type checking

## Commands

```bash
pnpm run dev            # start the Vite dev server
pnpm run fmt            # format the codebase
pnpm run fmt:check      # check formatting without changing files
pnpm run lint           # lint with oxlint and eslint
pnpm run lint:ci        # lint with GitHub-annotated output, for CI
pnpm run check          # type-check with vue-tsc, no emit
pnpm test               # run the Vitest suite
pnpm run build          # build for production into dist/
pnpm run preview        # preview the production build locally
pnpm run style:verify   # confirm the project actually consumes the shared presets
```

`pnpm run style:verify` is the acceptance test for the style wiring specifically. It checks that
`.editorconfig`, `oxfmt.config.ts`, `oxlint.config.ts`, `eslint.config.js`, and `tsconfig.json` are
still wired to `@matchory/coding-style`, not that the codebase is correctly formatted, linted, typed,
tested, or that it builds; `pnpm run fmt:check`, `lint`, `check`, `test`, and `build` cover those
separately. `--strict` on `style:verify` treats warnings as failures on top of that, nothing more.

## Style configuration lives elsewhere

Formatting and linting rules are not defined in this repository. They come from
`@matchory/coding-style` and are never edited locally:

- `oxfmt.config.ts` imports and re-exports the package's `oxfmtBase` preset.
- `oxlint.config.ts` imports and re-exports the package's `oxlintVue` preset.
- `eslint.config.js` calls the package's `withVue()` to build its config, for Vue-specific and
  type-aware rules oxlint does not yet cover, plus Tailwind class linting.
- `tsconfig.json` extends `@matchory/coding-style/tsconfig/vue.json`.
- `.editorconfig` is a synced copy, not authored here. EditorConfig has no way to extend a file
  shipped inside a package, so it's distributed by copy instead. Refresh it with
  `npx matchory-coding-style sync` if it ever drifts; never hand-edit it.

## `eslint.config.js`: two things not to simplify away

`eslint.config.js` wraps `withVue({ ... })` in `defineConfig()` imported from `eslint/config`.
`withVue` pushes a config object carrying a raw `extends:` key whenever `tailwindEntryPoint` is set,
and ESLint's flat config system rejects `extends` in a plain array. Without the wrapper, `eslint`
fails to start at all rather than reporting different lint results — this looks like unnecessary
boilerplate but is load-bearing.

`unknownTailwindClasses: true` in the same call differs from the shared package's own default of
`false`. It's what makes `better-tailwindcss/no-unknown-classes` actually report unrecognised
Tailwind classes, which is what lets the Tailwind rules fail a build. A codebase with a lot of
pre-existing hand-written Tailwind classes will see a wall of new errors the first time it lints
under this setting; that's the tradeoff for having the rule do anything at all.

Both are explained inline in `eslint.config.js` itself — read the comments there before touching
either.

## Tailwind class linting depends on `tailwindEntryPoint` resolving

`eslint.config.js` points `better-tailwindcss` at `src/style.css` so it can read the project's theme
and report both unknown classes and incorrect class order. If that path is renamed or moved without
updating `tailwindEntryPoint`, the plugin does not error — it silently stops checking Tailwind
classes at all, and lint stays green. Keep the two in sync.

## No build-only tsconfig

Unlike a published library, this is an application: `vite build` emits directly from `src` without a
separate `declaration`/`dist` step, so there is only one `tsconfig.json`. It extends the Vue preset,
which understands `.vue` files and sets `noEmit: true`; `pnpm run check` runs `vue-tsc --noEmit`
against it.

## Vite and Vitest configuration stays local

`vite.config.ts` carries both the Vite plugin setup (Vue, Tailwind) and the Vitest `test` block in
one file, deliberately: Vitest reuses the same plugins the app build uses. None of it imports from
`@matchory/coding-style` — build tooling like this is project-specific, not a style convention the
shared package tracks.

## Icons

Use the `Icon` component from `@matchory/ui` with Lucide icon components (`@lucide/vue`) instead of
inline SVG. `@matchory/ui` is not a dependency of this template; add it, along with the `.npmrc`
scope mapping documented in `README.md`, once the project needs it.

## Claude Code hook

`.claude/settings.json` runs `oxfmt` on a file after every edit, piped through `jq` to extract the
edited path; if that pipeline fails for any reason the hook no-ops instead of blocking, so formatting
falls back to whatever runs at `pnpm run fmt` or CI time.
