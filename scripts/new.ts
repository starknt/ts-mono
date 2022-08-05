import { join, resolve } from 'path'
import fs, { promises } from 'fs'
import { exec } from 'child_process'

const args = process.argv.slice(2)

if (args.length < 1 || typeof args[0] !== 'string') {
  console.error('\x1B[91m New Project Error: \x1B[0m This command must a new project name, like pnpm new core \x1B[0m')

  process.exit(0)
}

const rootPath = process.cwd()

const newPackagePath = resolve(rootPath, 'packages', args[0])

if (fs.existsSync(newPackagePath)) {
  console.error(`\x1B[91m New Project Error: \x1B[0m ${args[0]} project already exist.`)

  process.exit(0)
}

fs.mkdirSync(newPackagePath)

const packageTemplate = `
  {
    "name": "@pkg/${args[0]}",
    "version": "1.0.0",
    "description": "",
    "author": "",
    "license": "MIT",
    "keywords": [],
    "main": "./dist/index.cjs",
    "module": "./dist/index.mjs",
    "exports": {
      ".": {
        "import": "./dist/index.mjs",
        "require": "./dist/index.cjs",
        "default": "./dist/index.d.ts"
      }
    },
    "sideEffects": false,
    "scripts": {
      "stub": "unbuild --stub",
      "build": "unbuild"
    },
    "files": [
      "dist"
    ]
  }
`

const buildTemplate = `
  import { defineBuildConfig } from 'unbuild'

  export default defineBuildConfig({
    entries: ["./src/index"],
    rollup: {
      emitCJS: true
    },
    declaration: true,
    clean: true
  })
`

const packagePath = join(newPackagePath, 'package.json')
const buildFilePath = join(newPackagePath, 'build.config.ts')

Promise.all([
  promises.writeFile(packagePath, packageTemplate, 'utf-8'),
  promises.writeFile(buildFilePath, buildTemplate, 'utf-8'),
  promises.mkdir(join(newPackagePath, 'src'))
    .then(() => promises.writeFile(join(newPackagePath, 'src', 'index.ts'), 'export const add = (a: number, b: number) => a + b\n', 'utf-8')),
])
  .finally(() => exec('npx eslint . --fix'))
