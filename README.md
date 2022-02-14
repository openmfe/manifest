# The OpenMFE Manifest Tool

## Loading and Validation

The `@openmfe/manifest` tool retrieves and validates the contract of an OpenMFE microfrontend. It also resolves relative paths to full URLs. When you load a microfrontend’s manifest with this tool, you can be sure that the manifest complies with the OpenMFE specification.

The tool can be installed to any JavaScript project.

```shell
npm i @openmfe/manifest
```

Here’s how to run a manifest validation from the command line:

```shell
npx openmfe-validate http://localhost:8081/manifest/openmfe.yaml
```

You can also invoke it programmatically by loading it as a module (both ES and CommonJS are supported).

```js
import getManifest from "@openmfe/manifest"
const url = "http://localhost:8081/manifest/openmfe.yaml"
const manifest = getManifest(url) // returns the validated manifest.
```

### The Contract History Checker

The contract history checker makes sure that a microfrontend’s contract doesn’t introduce breaking changes over time. This is important because a microfrontend is supposed to be always deployed under the same URL. Therefore, its consumers must be confident that attributes, events and other aspects of the interface do not change in a breaking way. For this purpose, the contract checker installs a small `.contracts` file in the project and checks if the manifest at a given URL breaks the contract for the given microfrontend.

```shell
npx openmfe-contract http://localhost:8081/manifest/openmfe.yaml
```

This can be done in the microfrontend project itself or in a consuming project. It can also manage multiple microfrontends at the same time. So, if you are maintaining a website that uses multiple microfrontends, it can keep track of all of them and notify you if something breaks.
