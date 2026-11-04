# Project setup with npm and Vite

## Objectives

- Scaffold a Vite project with npm and start its development server on your own machine (performed as the first step of the S27 browser-client project, reused on Fast Track FT15; rehearsed in the page's practice terminal)
- Explain the roles of package.json, package-lock.json and node\_modules
- Distinguish dependencies from devDependencies and choose npm install or npm ci for a situation

## Teaching

You clone a teammate's Vite project. Its repository holds `package.json` and `package-lock.json`, but no `node_modules` folder. You immediately run this.

```
npm run dev
```

Vite is a development server and build tool. It needs Node.js 20.19+ or 22.12+. `npm create vite@latest` scaffolds a project; the extra `--` passes options through npm to the scaffolder.

```
npm create vite@latest my-app -- --template vanilla
cd my-app
npm install
npm run dev
```

Each command does one job: create files, enter the folder, install dependencies, start the server. This terminal only rehearses them. You will run them for real as the first step of the browser-client project.

Three things are easy to confuse.

- `package.json` is what you edit: the project's scripts and its dependency version ranges.
- `package-lock.json` is generated: the exact resolved version of every package, including indirect ones. Commit it, so everyone gets the same install.
- `node_modules` holds the installed packages. It is large and reproducible, so it is listed in `.gitignore` and never committed.

`dependencies` are packages your running app needs. `devDependencies` are needed only to develop, build or test: install those with `npm install --save-dev name`.

A production install can skip the second group with `--omit=dev`. Vite itself is a dev dependency, because its output is plain files that no longer need it. A library your own code imports for use at run time stays in `dependencies`.

Your team's CI server checks out the repository for each build. Builds must be repeatable, and the job must fail if `package.json` and the lockfile disagree.

## Recap

Scaffold, enter the folder, install, then run. `package.json` holds scripts and ranges, `package-lock.json` pins exact versions and is committed, and `node_modules` is reproducible and ignored. Runtime needs go in `dependencies`, tooling in `devDependencies`. Use `npm install` to change packages and `npm ci` for exact repeatable installs.

## Cheat sheet

What happens on the fresh clone?

- It fails, because `vite` is not installed yet: correct. The `dev` script calls `vite`, which lives in `node_modules`. That folder is not committed, so you must install first.
- npm downloads everything automatically, then starts the server: not correct. `npm run` only runs a script. It does not install anything.
- It starts, because `package.json` contains the code of its dependencies: not correct. `package.json` only lists names and version ranges.
- It starts, because Vite is built into Node.js: not correct. Vite is an ordinary package, so each project installs it.

Where to act: The terminal input, for the first command.

Next step: Copy the first line shown on this page. Watch for the double dash before the template option.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The terminal input, after scaffolding.

Next step: If `npm run dev` says vite is not found, ask which step puts packages on disk.

Run npm create vite@latest my-app -- --template vanilla, then cd my-app, then npm install, then npm run dev. Install adds node_modules and package-lock.json. The dev server prints a local address such as http://localhost:5173/.

Where to act: The row about teammates.

Next step: Ask which file records exact versions rather than ranges.

- You add a `dev` script here: package.json. Scripts live in `package.json`, and `npm run` reads them there.
- Keeps teammates on identical versions of every package: package-lock.json. The lockfile records the exact resolved tree.
- Deleted safely, because an install recreates it: node_modules. It is derived from the two files, so it is not committed.
- Declares a range such as `^7.0.0`: package.json. Ranges live in `package.json`. The lockfile pins what a range resolved to.

Where to act: Each row's description.

Next step: Ask whether the deployed application still needs this package when a user opens the page.

- `vite`: the dev server and build tool: devDependencies. It produces the output, and is not part of what runs in the browser.
- `vitest`: runs your tests: devDependencies. Tests run during development and CI only.
- `date-fns`: your app imports it to format dates for users: dependencies. Your running code calls it.
- `eslint`: checks code style before you commit: devDependencies. It works on source during development.

Which install command fits this CI job?

- `npm ci`: correct. It installs exactly what the lockfile lists, removes any existing `node_modules` first, and exits with an error if the lockfile and `package.json` disagree.
- `npm install`: not correct. It may update the lockfile to resolve a mismatch, so the build would not fail as required.
- `npm run dev`: not correct. That starts the dev server and installs nothing.
- Commit `node_modules` and skip installing: not correct. The folder is large, platform-specific and reproducible, so it stays out of the repository.

```
npm create vite@latest my-app -- --template vanilla
cd my-app
npm install
npm run dev
npm install --save-dev vitest
npm ci
```

## Sources

- npm docs: npm ci, retrieved 2026-11-04
- npm docs: npm install, retrieved 2026-11-04
- npm docs: package.json, retrieved 2026-11-04
- Vite: Getting started, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What happens on the fresh clone?

- It fails, because `vite` is not installed yet: correct. The `dev` script calls `vite`, which lives in `node_modules`. That folder is not committed, so you must install first.
- npm downloads everything automatically, then starts the server: not correct. `npm run` only runs a script. It does not install anything.
- It starts, because `package.json` contains the code of its dependencies: not correct. `package.json` only lists names and version ranges.
- It starts, because Vite is built into Node.js: not correct. Vite is an ordinary package, so each project installs it.

### terminal

### Static alternative

Run npm create vite@latest my-app -- --template vanilla, then cd my-app, then npm install, then npm run dev. Install adds node_modules and package-lock.json. The dev server prints a local address such as http://localhost:5173/.

### explore

### Static alternative

- You add a `dev` script here: package.json. Scripts live in `package.json`, and `npm run` reads them there.
- Keeps teammates on identical versions of every package: package-lock.json. The lockfile records the exact resolved tree.
- Deleted safely, because an install recreates it: node_modules. It is derived from the two files, so it is not committed.
- Declares a range such as `^7.0.0`: package.json. Ranges live in `package.json`. The lockfile pins what a range resolved to.

### explore

### Static alternative

- `vite`: the dev server and build tool: devDependencies. It produces the output, and is not part of what runs in the browser.
- `vitest`: runs your tests: devDependencies. Tests run during development and CI only.
- `date-fns`: your app imports it to format dates for users: dependencies. Your running code calls it.
- `eslint`: checks code style before you commit: devDependencies. It works on source during development.

### mcq

### Static alternative

Which install command fits this CI job?

- `npm ci`: correct. It installs exactly what the lockfile lists, removes any existing `node_modules` first, and exits with an error if the lockfile and `package.json` disagree.
- `npm install`: not correct. It may update the lockfile to resolve a mismatch, so the build would not fail as required.
- `npm run dev`: not correct. That starts the dev server and installs nothing.
- Commit `node_modules` and skip installing: not correct. The folder is large, platform-specific and reproducible, so it stays out of the repository.
