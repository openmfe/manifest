#!/usr/bin/env node

import * as fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { URL } from 'url'

// checks
import processManifest from '../src/manifest.js'

;(async () => {
    const manifestUrl = process.argv[2]

    if (!manifestUrl)
        throw new Error("A URL must be provided.")

    const manifest = await fetch(manifestUrl).then(data => data.text())

    try {
        processManifest(manifest)
    } catch (e) {
        console.error(e.message)
        process.exit(1)
    }
})()
