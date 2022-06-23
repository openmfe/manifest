import * as fs from 'fs'
import yaml from 'yaml'
import Ajv from 'ajv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
import fetch from 'node-fetch'


// loads manifest from a URL, validates it and returns it if it is valid
// if the url param is set, relative URLs will be resolved
export default async function(url) {

    const data = await fetch(url).then(res => res.text())
    const manifest = yaml.parse(data)

    const ajv = new Ajv()
    const schema = JSON.parse(fs.readFileSync(`${__dirname}/schema.json`).toString())
    const validate = ajv.compile(schema)

    if (!validate(manifest)) {
        throw new Error("× The manifest is invalid: " + JSON.stringify(validate.errors, null, 4))
    }

    // resolve relative URLs
    if (manifest.documentation) {
        manifest.documentation = (new URL(manifest.documentation, url)).href
    }
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

    ;['attributes', 'events', 'functions'].forEach(list => {
        if (manifest[list]) {
            manifest[list] = manifest[list].map(item => {
                if (item.documentation) {
                    item.documentation = (new URL(item.documentation, url)).href
                }

                return item
            })
        }
    })

    return manifest
}
