# CLAUDE.md

- Lint, format and tsconfig rules come from `@matchory/coding-style`. Change them there, not in this
  repo's config files. `pnpm run style:verify` only checks that the presets are imported, so local
  overrides pass it. If it reports `.editorconfig` as out of date, run `npx matchory-coding-style sync`.
- Icons: use the `Icon` component from `@matchory/ui` with `@lucide/vue` icons, not inline SVG. Add
  `@matchory/ui` and the `.npmrc` from the README when the project first needs an icon.
- Running CI's `pnpm audit --ignore ...` locally creates an untracked `pnpm-workspace.yaml`. Delete it;
  do not commit it.
