# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.1] - 2026-09-10

### Fixed

- Published the Flat Config entrypoint through the package's main export so consuming
  projects no longer receive the legacy `extends` object.

## [2.0.0] - 2026-09-10

### Changed

- Migrated the shared configuration to ESLint flat config via `eslint.config.js`.
- Raised ESLint to 9, Prettier to 3 and `eslint-plugin-prettier` to 5.
- Updated the `4th-eslint` wrapper to load the shared flat config explicitly.
- Updated `4th-eslint-init` to generate `eslint.config.js` instead of the legacy
  `eslintConfig` package.json entry.

## [1.2.0] - 2026-09-10

### Fixed

- Removed a malformed, dead rule entry: `'no-param-reassign:': 0` (note the
  stray trailing colon inside the key) is not a valid rule name, so it was
  always a silent no-op - `no-param-reassign` was in fact already enforced
  at its `eslint-config-airbnb-base` default (`error`, `props: true`) the
  entire time. Verified against all 7 framework-baseline projects: over 100
  files already carry a legitimate, working
  `/* eslint-disable no-param-reassign */` for exactly this reason (jQuery/
  ACF/DOM callbacks that mutate their argument). **This is a no-op cleanup,
  not a rule change** - turning the rule fully off centrally was considered
  and rejected, since it would make every one of those existing disable
  comments an "unused eslint-disable directive" error (the `4th-eslint` bin
  always runs with `--report-unused-disable-directives`), breaking lint
  fleet-wide on upgrade. No consumer disable comments were touched.
- Removed the duplicate Prettier wiring: `extends` listed both
  `'eslint-config-prettier'` and its `'prettier'` alias (the same package,
  loaded twice), in addition to a manually configured `eslint-plugin-prettier`
  rule. Replaced with the single official `'plugin:prettier/recommended'`
  composition, which wires up both packages consistently and avoids
  conflicting/duplicate formatting rule sources.

### Evaluated, not changed

- Centralizing the WordPress/ACF/jQuery platform globals (`jQuery`, `wp`, `acf`,
  `ajaxurl`) via `env.jquery` / `globals` was tried and reverted: nearly every
  fleet file that uses them also carries its own
  `/* global jQuery */` / `/* global acf */` / `/* global wp */` comment.
  Declaring the same identifier both in config and via an inline `/* global */`
  comment makes ESLint's `no-redeclare` fire (`'jQuery' is already defined as
  a built-in global variable`) - verified against the real fleet code, this
  broke dozens of previously-clean files. Centralizing these globals would
  require removing the now-redundant local comments in every affected file
  first, across all 7 projects - out of scope for this pass. Left as a
  documented follow-up (see README).

### Changed

- Bumped `eslint` (`^8.11.0` → `^8.57.1`, latest ESLint 8.x - `eslint-config-airbnb`/`-base`
  do not yet support ESLint 9/10, so the major version was deliberately kept at 8).
- Bumped `eslint-config-prettier` (`^3` → `^10.1.8`) so more of the newer
  stylistic ESLint rules that conflict with Prettier are disabled.
- Replaced the unused `eslint-config-airbnb` dependency with the package it
  was actually resolving through transitively, `eslint-config-airbnb-base`
  (`^15.0.0`), which is what `extends: ['airbnb-base/legacy', ...]` requires.
  Depending on it only transitively was fragile (not guaranteed to resolve
  under strict package managers / Yarn PnP).
- Raised `engines.node` from the long-stale `>=6` to `>=16` (ESLint 8's own
  minimum realistic floor; all current fleet projects already run Node
  >=16, most on Node 22+).

### Removed

- `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`:
  never referenced by `index.js` (the config only extends `airbnb-base/legacy`,
  not the React-aware `eslint-config-airbnb`), and no fleet project uses React
  (verified: zero `.jsx`/`.tsx` files, no `react` dependency in any of the 7
  framework-baseline projects). Pure dead weight.
- `typescript`: never wired up (no `@typescript-eslint/parser` or
  `@typescript-eslint/eslint-plugin`, no `.ts` override block), and zero
  `.ts`/`.tsx` files exist across the framework-baseline fleet. If TypeScript
  is introduced later, add `@typescript-eslint/*` plus a dedicated
  `overrides` block for `*.ts(x)` at that point - do not just re-add the bare
  `typescript` package.
- `eslint-plugin-import`: installed but never wired into `extends`/`plugins`,
  so `import/order` and import-resolution rules were never actually enforced.
  Not re-added in this pass: enabling it fleet-wide (incl. `import/order`)
  is a genuine rule addition, not a cleanup, and needs its own dry run across
  all 7 projects to size the diff/false-positive risk first (see README).



### Fixed

- Replaced the `4th-eslint` shell-script bin (`bin/eslint.sh`) with a Node
  script (`bin/eslint.js`). Yarn Berry (v2+) executes package bins through a
  Node loader, so the shell wrapper crashed with
  `SyntaxError: Invalid or unexpected token`. The Node bin also resolves
  eslint from this package's own dependencies, so it keeps working when
  eslint is not hoisted into the consuming project.

