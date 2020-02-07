#!/usr/bin/env node
const path = require('path')
const fs = require('fs')

const findUpwards = (directory) => {
  let rootPath = process.cwd()
  while (path.resolve(rootPath).toString() !== '/') {
    const isGitRoot = fs.existsSync(path.resolve(rootPath, directory))
    if (isGitRoot) {
      break
    }
    rootPath += '/..'
  }
  return path.resolve(rootPath).toString()
}

const main = () => {
  console.log('\nHooking Git > searching `.git` folder')
  const gitRoot = findUpwards('.git')
  // create hooks directory to be safe
  fs.mkdirSync(path.resolve(gitRoot, '.git', 'hooks'), { recursive: true })

  // define hooks to be templated
  const hooks = [
    'pre-push',
    'pre-commit',
    'post-commit',
    'post-merge',
  ]

  const packageJsonPath = `${process.cwd()}/package.json`
  const template = `#!/usr/bin/env node
"use strict";
var path = require("path");
var execSync = require("child_process").execSync;
var hook = path.basename(__filename);
var packageJson = require(path.resolve("${packageJsonPath}"));
var hooks = packageJson["hooking-git"] || {};

if (!hooks[hook]) {
  process.exit(0);
}

try {
  execSync(hooks[hook], {
    encoding: "utf-8",
    stdio: "inherit"
  });
} catch (error) {
  process.exit(error.status);
}
`

  // write templates
  hooks.forEach((hook) => {
    console.log(`Hooking Git > writing templates > ${hook}`)
    const hookPath = path.resolve(gitRoot, '.git', 'hooks', hook)
    fs.writeFileSync(hookPath, template)
    fs.chmodSync(hookPath, '755')
  })

  console.log('Hooking Git > done\n')
}

main()
