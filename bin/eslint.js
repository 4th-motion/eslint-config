#!/usr/bin/env node
const path = require('path')
const { spawnSync } = require('child_process')

const manifestPath = require.resolve('eslint/package.json')
const manifest = require(manifestPath)
const binField = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin.eslint
const eslintBin = path.join(path.dirname(manifestPath), binField)

const result = spawnSync(
  process.execPath,
  [
    eslintBin,
    '--config',
    path.join(__dirname, '..', 'eslint.config.js'),
    '--report-unused-disable-directives',
    '--max-warnings',
    '0',
    ...process.argv.slice(2)
  ],
  { stdio: 'inherit' }
)

process.exit(result.status === null ? 1 : result.status)
