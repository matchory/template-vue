# Matchory Vue Template

A minimal, opinionated starting point for new Matchory Vue applications. It is a Vite + Vue 3 +
TypeScript + Tailwind v4 project with formatting, linting, type checking, and testing already wired
up against [`matchory/coding-style`](https://github.com/matchory/coding-style), so a new project
starts with the same conventions as the rest of the codebase instead of drifting from day one.

## Getting started

Create a new repository from this template, then set up the project locally:

```bash
gh repo create your-project --template matchory/template-vue --private --clone
cd your-project
pnpm install
```

From there, run `pnpm run dev` to start the Vite dev server, `pnpm test` to confirm the default
Vitest suite passes, and `pnpm run style:verify` to confirm the style tooling is correctly wired up.

## No `.npmrc`, on purpose

This template ships without an `.npmrc`, so `pnpm install` resolves every dependency, including
`@matchory/coding-style`, from the public npm registry, unauthenticated. npm and pnpm resolve
registries per scope, not per package, so there is no way to route one `@matchory` package to a
different registry than another: the mapping applies to the whole scope at once. That is exactly
why `@matchory/coding-style` is published as identical bytes to both npmjs and GitHub Packages —
this template can depend on it without any registry configuration at all.

The moment a project also needs a package that is only published privately, such as `@matchory/ui`,
add an `.npmrc` that points the entire `@matchory` scope at GitHub Packages with an authentication
token. From then on every `@matchory` package, including `coding-style`, resolves through that
registry instead of npmjs.

## Why Tailwind is here, not optional

Class ordering is owned by `eslint-plugin-better-tailwindcss`, not oxfmt's sorter, because the
plugin is theme-aware through its stylesheet entry point and also reports unknown Tailwind classes.
`eslint.config.js` points it at `src/style.css` via `tailwindEntryPoint`. If that path stops
resolving to a real stylesheet, the Tailwind rules are skipped entirely and silently: nothing is
reported, and the build still looks green. That's why `src/style.css` and the `@tailwindcss/vite`
plugin in `vite.config.ts` are load-bearing parts of this template, not extras to strip out.

`unknownTailwindClasses: true` in `eslint.config.js` is a choice this template makes deliberately,
and it differs from the shared package's own default of `false`. With it on, an unrecognised
Tailwind class is a lint error, which is what makes the Tailwind rules able to fail a build at all.
The cost: dropping this template into a codebase that already has hand-written Tailwind classes with
typos or outdated utility names will surface all of them as `no-unknown-classes` errors on the first
`pnpm run lint`. Set it back to `false` if that's more noise than the project wants to deal with
right away; the class-order rule keeps working either way.

## Icons

Matchory Vue projects use the `Icon` component from `@matchory/ui` together with Lucide icon
components, instead of inline SVG:

```vue
import { Icon } from '@matchory/ui';
import { CircleAlert } from '@lucide/vue';
//
<Icon :icon="CircleAlert" />
```

`@matchory/ui` is **not** a dependency of this template. It's a private package published to GitHub
Packages; add it, and the `.npmrc` scope mapping described above, once the project actually needs
it.

## Publishing this repository

`package.json` has `"private": true` and no publish-related fields, because this template is meant
to be used as a GitHub template (`--template`), not published to a registry itself. There is
deliberately no `LICENSE` file either; add one appropriate to the project once it exists as its own
repository.

## What's wired up, and why

**`.editorconfig` is a synced copy, not authored here.** It's distributed by copy from
`matchory/coding-style` because EditorConfig has no mechanism for extending a file shipped inside a
package: `root = false` only walks up the directory tree, it can't reach into an installed
dependency. Refresh it with `npx matchory-coding-style sync` if it ever drifts from the canonical
version; never hand-edit it. It's one of the checks `style:verify` runs, so a drifted copy fails CI
with no more diagnosis than "not up to date" — running `sync` is the fix.

**`eslint.config.js` wraps `withVue(...)` in `defineConfig()` from `eslint/config`.** This is not
stylistic. `withVue` returns a config object carrying a raw `extends:` key whenever
`tailwindEntryPoint` is set, and ESLint's flat config system rejects `extends` outside of
`defineConfig()`. Remove the wrapper and `eslint` fails to start at all — "A config object is using
the `extends` key, which is not supported in flat config system" — rather than merely reporting lint
errors differently. Keep it.

**`vite.config.ts` carries both the Vite build and the Vitest configuration.** They live in the same
file because Vitest can reuse the Vite plugins (Vue, Tailwind) directly. This is deliberate,
project-specific build tooling, not a style convention the shared package tracks, so it stays local
rather than importing from `matchory/coding-style`.

**`tsconfig.json` extends the Vue preset**, which understands `.vue` files and sets `noEmit: true`.
`pnpm run check` runs `vue-tsc --noEmit` against it, which type-checks both script blocks and
templates. There is no separate build tsconfig: this is an application, not a published library, so
`vite build` emits directly from source without a `declaration`/`dist` step.

**`pnpm run style:verify` is the acceptance test**, not a general correctness check. It checks five
things: `.editorconfig` matches the canonical copy, `oxfmt.config.ts` imports the shared preset,
`oxlint.config.ts` imports the shared preset, `eslint.config.js` imports the shared preset, and
`tsconfig.json` extends a shared preset. It does not run tests, does not build, and does not lint or
type-check the codebase; `--strict` only means warnings are treated as failures on top of that. CI
runs it as its own job, separate from lint, type check, test, and build, on every push to `main` and
every pull request, and it's worth running locally after touching any of the files above.

## Commands

```bash
pnpm run dev            # start the Vite dev server
pnpm run fmt            # format the codebase
pnpm run fmt:check      # check formatting without changing files
pnpm run lint           # lint with oxlint and eslint
pnpm run check          # type-check with vue-tsc, no emit
pnpm test               # run the Vitest suite
pnpm run build          # build for production into dist/
pnpm run preview        # preview the production build locally
pnpm run style:verify   # verify the style tooling is correctly wired up
```

## What this template deliberately doesn't include

This is a starting point, not a scaffold for a specific application. It has one component rendering
a greeting and nothing else: no router, no state management, no API layer. Those are exactly the
things a real project adds first. See `CLAUDE.md` for the conventions to follow once you do.
