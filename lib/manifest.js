import * as fs from 'fs'
import yaml from 'yaml'
import Ajv from 'ajv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

// validates the manifest and returns it if it is valid
// if the url param is set, relative URLs will be resolved
export default function(manifest, url = "") {
    if (typeof manifest === "string") {
        // could be JSON or YAML, but as every JSON is valid YAML by definition, this doesn’t hurt
        manifest = yaml.parse(manifest)
    }

    const ajv = new Ajv()
    const schema = JSON.parse(fs.readFileSync(`${__dirname}/schema.json`).toString())
    const validate = ajv.compile(schema)

    if (!validate(manifest)) {
        throw new Error("× The manifest is invalid: " + JSON.stringify(validate.errors, null, 4))
    }

    // resolve relative URLs
    if (url) {
        manifest.documentation = (new URL(manifest.documentation, url)).href
        manifest.icon = (new URL(manifest.icon, url)).href
        manifest.url.frontend = (new URL(manifest.url.frontend, url)).href
        manifest.url.prerender = (new URL(manifest.url.prerender, url)).href


        if (manifest.url.semantic) {
            manifest.url.semantic = (new URL(manifest.url.semantic, url)).href
        }

        if (manifest.screenshots && manifest.screenshots.length) {
            manifest.screenshots = manifest.screenshots.map(screenshot => {
                screenshot.url = (new URL(screenshot.url, url)).href
                return screenshot
            })
        }

        ;['attributes', 'events'].forEach(list => {
            manifest[list] = manifest[list].map(item => {
                if (item.documentation) {
                    item.documentation (new URL(item.documentation, url)).href
                }

                return item
            })
        })
    }

    return manifest
}
