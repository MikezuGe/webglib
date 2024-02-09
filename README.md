# Installing

```sh
npm install
```

# Development

To develop an app

```sh
cd apps/<app-name>
npm start
```

then navigate to [localhost:1234](http://localhost:1234) with preferred browser. The webpage should reload every time a related file is saved.

To develop a package

```sh
cd packages/<package-name>
npm start
```

# Testing

```sh
# To run all tests for all apps and packages
npm test

# Run tests for an app
npm test -w @webglib/<app-name>
# Or in the app's folder
npm test

# Run tests for a package
npm test -w @webglib/<package-name>
# Or in the package's folder
npm test
```

# Linting

```sh
# To lint all apps and packages
npm run lint

# To lint an app
npm run lint -w @webglib/<app-name>
# Or in an app's folder
cd apps/<app-name>
npm run lint

# To lint a package
npm run lint -w @webglib/<package-name>
# Or in a package's folder
cd packages/<package-name>
npm run lint
```

# Installing dependencies

Install dependencies when they're needed in apps or packages.

Installing packages in this monorepo to other packages or apps in this monorepo works like installing npm packages.

```sh
# To install dependencies for all apps and packages
npm install [<package-spec> ...] -ws [-D/--save-dev]
# Note -ws is shorthand for '--workspaces'

# To install dependencies for a certain app
npm install [<package-spec> ...] -w @webglib/<app-name> [-D/--save-dev]
# Or in an app's folder
cd apps/<app-name>
npm install [<package-spec> ...] [-D/--save-dev]

# To install dependencies for a certain package
npm install [<package-spec> ...] -w @webglib/<package-name> [-D/--save-dev]
# Or in a package's folder
cd packages/<package-name>
npm install [<package-spec> ...] [-D/--save-dev]
```

# Adding new apps

```sh
./scripts/create_app.sh <app-name>
```

# Adding new packages

```sh
./scripts/create_package.sh <package-name>
```

# TODO

- HOT reload for delevoping packages
  - nodemon? Parcel outputs single file in watch mode, follow changes for that
- Add build instructions
- Release
  - Find out how to do it
  - Add instructions
