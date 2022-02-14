import * as fs from 'fs'
import { detailedDiff } from 'deep-object-diff'
import getManifest from './manifest.js'

export default async function(url, history) {

    const manifest = await getManifest(url)

    // remove all fields that are not essentially the contract
    const contract = deleteFields(manifest, ["description", "documentation", "publisher", "icon", "screenshots", "examples"])

    if (history[url]) {
        const diff = detailedDiff(history[url].contract, contract)

        if (Object.keys(diff.updated).length || Object.keys(diff.deleted).length) {
            throw new Error("The contract has been modified in a breaking way: " + JSON.stringify(diff, null, 4))
        }
    }

    history[url] = {
        updated : Math.floor(Date.now() / 1000),
        contract
    }

    return history
}

function deleteFields(tree, fields = []) {
    Object.keys(tree).forEach(key => {
        if (fields.includes(key)) {
            delete tree[key]
        }

        else if (tree[key] instanceof Array) {
            tree[key] = tree[key].map(value => deleteFields(value, fields))
        }

        else if (tree[key] instanceof Object) {
            tree[key] = deleteFields(tree[key], fields)
        }
    })

    return tree
}
