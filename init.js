#!/usr/bin/env node
/* eslint-disable no-console, consistent-return, no-restricted-syntax */
const fs = require('fs')
const arg = require('arg')
const chalk = require('chalk')
const path = require('path')

const args = arg({ '--force': Boolean })

console.log(chalk`          Initiating eslint configuration.`)

// get package.json content
const getPackageContent = packagePath => {
  try {
    return fs.readFileSync(packagePath, 'utf-8')
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(chalk`{bold.red [ERROR]  } No package.json was found in {underline ${packagePath}}.`)
      process.exit(1)
    }
  }
}

const PACKAGE_FILENAME = 'package.json'
const packagePath = path.join(process.cwd(), PACKAGE_FILENAME)
const packageLocalPath = path.join(__dirname, PACKAGE_FILENAME)

const pkg = JSON.parse(getPackageContent(packagePath))
const pkgLocal = JSON.parse(getPackageContent(packageLocalPath))

// logging messages
const messageAdded = name => chalk`{bold.magenta [ADDED]  } {bold ${name}} in ${PACKAGE_FILENAME}.`
const messageCantOverwrite = name =>
  chalk`{bold.red [ERROR]  } can't overwrite {bold ${name}} in ${PACKAGE_FILENAME}. Use {underline --force} to overwrite the existing value.`
const messageWasOverwritten = name =>
  chalk`{bold.yellow [WARNING]} {bold ${name}} in ${PACKAGE_FILENAME} was overwritten.`

const handleOverwrite = (key, name) => {
  if (key) {
    if (args['--force']) {
      console.warn(messageWasOverwritten(name))
    } else {
      console.error(messageCantOverwrite(name))
      process.exit(2)
    }
  } else {
    console.log(messageAdded(name))
  }
}

function getKeyByValue(object, value) {
  return object ? Object.keys(object).find(key => object[key] === value) : null
}

// get task name from bin field in package.json
const TASK_NAME = getKeyByValue(pkgLocal.bin, './bin/eslint.sh') || '4th-eslint'

// add script `lint:js` to package.json
handleOverwrite(pkg.scripts['lint:js'], 'lint:js')
pkg.scripts['lint:js'] = `${TASK_NAME} './**/*.js' --color --fix --quiet`

// add `eslintConfig`
handleOverwrite(pkg.eslintConfig, 'eslintConfig')
pkg.eslintConfig = { extends: [pkgLocal.name] }

// add pre-commit script to package.json
const GIT_HOOKS_NAME = '@4th-motion/git-hooks'

if (pkg.devDependencies && pkg.devDependencies[GIT_HOOKS_NAME]) {
  console.log(
    chalk`{cyanBright.bold [INFO]   } found {underline ${GIT_HOOKS_NAME}} in ${PACKAGE_FILENAME}. Adding a lint step to the {bold pre-commit} hook.`
  )

  // add script `lint:js:staged` to package.json
  const LINT_STAGED_SCRIPTNAME = 'lint:js:staged'
  const LINT_STAGED_SCRIPT = `git diff --diff-filter=ACMRT --cached --name-only --quiet './**/*.js' | xargs ${TASK_NAME}`

  handleOverwrite(pkg.scripts[LINT_STAGED_SCRIPTNAME], LINT_STAGED_SCRIPTNAME)
  pkg.scripts[LINT_STAGED_SCRIPTNAME] = LINT_STAGED_SCRIPT

  // add pre-commit task
  pkg.git = pkg.git || {}

  if (!pkg.git['pre-commit']) {
    pkg.git['pre-commit'] = LINT_STAGED_SCRIPTNAME
  } else {
    if (typeof pkg.git['pre-commit'] === 'string') {
      pkg.git['pre-commit'] = [pkg.git['pre-commit']]
    }

    // add task only if it does not yet exist
    if (!pkg.git['pre-commit'].filter(task => task === LINT_STAGED_SCRIPTNAME).length) {
      pkg.git['pre-commit'].unshift(LINT_STAGED_SCRIPTNAME)
    }
  }

  console.log(messageAdded('pre-commit'))
}

// write to package.json
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, '  '), 'utf-8')

// copy base files from this repository
const filesTopCopy = ['.prettierrc.js', '.editorconfig']

filesTopCopy.forEach((fileName, index) => {
  const src = path.join(__dirname, fileName)
  const dest = path.join(process.cwd(), fileName)

  if (src === dest) return

  fs.copyFile(src, dest, error => {
    if (error) {
      console.error(chalk`{bold.red [ERROR]  } Could not copy ${fileName}.`)
    } else {
      console.log(chalk`{bold.magenta [ADDED]  } {bold ${fileName}}`)

      // success message
      if (index === filesTopCopy.length - 1) {
        setTimeout(() => {
          console.log(chalk`{bold.green [SUCCESS]} Linter configuration initialized!`)
          console.log(chalk`          You can now start using {underline yarn lint:js} to check your code.`)
        }, 150)
      }
    }
  })
})
