#!/usr/bin/env node

import * as fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { URL } from 'url'
import getManifest from '../dist/manifest.js'

;(async () => {
    const url = process.argv[2]

    if (!url)
        throw new Error("A URL must be provided.")

    try {
        await getManifest(url)
    } catch (e) {
        console.error(e.message)
        process.exit(1)
    }
})()
