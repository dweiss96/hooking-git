# hooking-git

This package helps you to integrate git hooks into your Javascript project workflow.

# installation

## npm

`npm i --save-dev hooking-git`

## yarn

`yarn cache clean hooking-git && yarn add --dev hooking-git`

# uninstall
- remove dependendecy from the project
- `yarn remove hooking-git` or `npm uninstall --save hooking-git`
- remove `<git-root>/.git/hooks`

# usage

Specify the used hooks in your `package.json`:

```
{
  ...,
  "hooking-git": {
    "pre-push": "yarn lint && yarn test"
  }
}
```

## Currently supported hooks
- pre-push
- pre-commit
- post-merge
- post-commit
