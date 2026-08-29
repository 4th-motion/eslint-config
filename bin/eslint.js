#!/usr/bin/env node
// Must be a Node script: Yarn Berry runs package bins through a Node
// loader, so a shell script here fails with a SyntaxError. Resolving
// eslint from this package's own dependencies also keeps the wrapper
// working when eslint is not hoisted into the consuming project.
const path = require('path');
const { spawnSync } = require('child_process');

const manifestPath = require.resolve('eslint/package.json');
const manifest = require(manifestPath);
const binField = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin.eslint;
const eslintBin = path.join(path.dirname(manifestPath), binField);

const result = spawnSync(
  process.execPath,
  [eslintBin, '--report-unused-disable-directives', '--max-warnings', '0', ...process.argv.slice(2)],
  { stdio: 'inherit' }
);

process.exit(result.status === null ? 1 : result.status);
