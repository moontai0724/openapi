# @moontai0724/package-template

[![NPM Version](https://img.shields.io/npm/v/@moontai0724/package-template)](https://www.npmjs.com/package/@moontai0724/package-template)
[![NPM Downloads](https://img.shields.io/npm/d18m/@moontai0724/package-template)](https://www.npmjs.com/package/@moontai0724/package-template)
[![Codecov](https://codecov.io/gh/moontai0724/package-template/graph/badge.svg)](https://codecov.io/gh/moontai0724/package-template)

## Features

- [x] TypeScript
- [x] [ESLint](https://eslint.org) + [Prettier](https://prettier.io): Coding Style & Formatter
  - [Husky](https://github.com/typicode/husky) + [Lint-staged](https://github.com/okonet/lint-staged): Pre-commit hooks
  - [Airbnb Coding Style](https://github.com/airbnb/javascript)
  - Auto [organize imports](https://github.com/import-js/eslint-plugin-import).
  - Auto sort [imports](https://github.com/lydell/eslint-plugin-simple-import-sort) and [object keys](https://github.com/infctr/eslint-plugin-typescript-sort-keys).
- [x] [Rollup](https://rollupjs.org/): Bundle the package
  - [Babel](https://github.com/rollup/plugins/tree/master/packages/babel): Compile the code to ES5 compatible
  - [Terser](https://github.com/rollup/plugins/tree/master/packages/terser): Minify the code
- [x] [Vitest](https://github.com/vitest-dev/vitest): Tests and [Coverage](https://github.com/vitest-dev/vitest/tree/main/packages/coverage-v8)
- [x] [Semantic Release](https://github.com/semantic-release/semantic-release): Auto versioning, Changelog and Release
  - [@semantic-release/changelog](https://github.com/semantic-release/changelog): Generate changelog based on the commit messages
  - [@semantic-release/github](https://github.com/semantic-release/github): Create a release on GitHub
  - [@semantic-release/npm](https://github.com/semantic-release/npm): Publish the package to npm & update the package version
  - [@semantic-release/git](https://github.com/semantic-release/git): Commit the version change back to the repository
- [x] [CodeCov](https://codecov.io): Code coverage
- [x] [Typedoc](https://github.com/TypeStrong/typedoc): API documentation
- [x] GitHub Actions: CI/CD

## Getting Started

### 1. Use this template to create a new repository.

Click the [`Use this template`](https://github.com/new?template_name=package-template&template_owner=moontai0724) button on the top right corner of the repository page.

### 2. Clone the repository, and install the dependencies.

Just clone your repo and install the dependencies with any package manager you like. This template does not strong bind to any package manager, but the used package manager in GitHub Actions workflow is `pnpm`. You may need to modify the workflow file if you use other package managers.

### 3. Modify the package content to fit your project.

There are few places you need to modify to fit your project, like `package.json`, `README.md`. You can use the following command to replace most of the content:

```bash
YOUR_GITHUB_USER="your-user-name"
YOUR_REPO_NAME="your-awesome-package-name"
sed -i "s/moontai0724/${YOUR_GITHUB_USER}/g" package.json README.md .github/workflows/*
sed -i "s/package-template/${YOUR_REPO_NAME}/g" package.json README.md .github/workflows/*
```

### 4. Start coding!

## Publish

This template uses [CodeCov](https://docs.codecov.com/docs/quick-start) to check the code coverage. You can remove the CodeCov badge and the related scripts in `package.json` if you don't need it.
If you want to use CodeCov, you need to set the `CODECOV_TOKEN` in the [repository secrets](https://github.com/moontai0724/package-template/settings/secrets/actions).

Once you done, you can push your codes to the `release` branch.

The actions in this template will auto perform following steps when you push the code to the `release` branch:

- Test: Run tests and generate coverage report
- Build: Generate bundled and minified esm, cjs version (for browser), and unminified esm version (for node).
- Release: Bump Version & Generate Changelog
- [Publish the package to npm](https://www.npmjs.com/package/@moontai0724/package-template/)
- [Publish docs to GitHub Pages](https://moontai0724.github.io/package-template/): You may need to setup the GitHub Pages in the repository settings.

You can modify the workflow file to fit your needs.

## Install

### NPM

```bash
npm install @moontai0724/package-template
```

### Yarn

```bash
yarn add @moontai0724/package-template
```

### PNPM

```bash
pnpm add @moontai0724/package-template
```

## Usage

```typescript
import { add, divide, max } from "@moontai0724/package-template";

add(1, 2); // 3
divide(1, 2); // 0.5
max(1, 2); // 2
```

## API Document

See the [API documentation](https://moontai0724.github.io/package-template/).
