#!/usr/bin/env node

import * as fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { URL } from 'url'

import processManifest from '../lib/manifest.js'
import checkContract from '../lib/contract.js'

;(async () => {
    const url = process.argv[2]

    if (!url)
        throw new Error("A URL must be provided.")

    const data = await fetch(url).then(x => x.text())

    try {
        const manifest = processManifest(data, url)
        const histFile = `${process.env.npm_config_local_prefix}/.contracts`
        const history = fs.existsSync(histFile)
            ? JSON.parse(fs.readFileSync(histFile))
            : {}

        const newHistory = checkContract(url, manifest, history)
        fs.writeFileSync(histFile, JSON.stringify(newHistory, null, 4))
    } catch (e) {
        console.error(e.message)
        process.exit(1)
    }
})()
