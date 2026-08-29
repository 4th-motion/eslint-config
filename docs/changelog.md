# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.1.2] - 2026-08-29

### Fixed

- Replaced the `4th-eslint` shell-script bin (`bin/eslint.sh`) with a Node
  script (`bin/eslint.js`). Yarn Berry (v2+) executes package bins through a
  Node loader, so the shell wrapper crashed with
  `SyntaxError: Invalid or unexpected token`. The Node bin also resolves
  eslint from this package's own dependencies, so it keeps working when
  eslint is not hoisted into the consuming project.

