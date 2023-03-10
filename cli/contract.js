#!/usr/bin/env node

import * as fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { URL } from 'url'
import checkContract from '../dist/contract.js'

;(async () => {
    const url = process.argv[2]

    if (!url)
        throw new Error("A URL must be provided.")

    try {
        const histFile = `${process.cwd()}/.contracts`

        const history = fs.existsSync(histFile)
            ? JSON.parse(fs.readFileSync(histFile))
            : {}

        const newHistory = await checkContract(url, history)

        fs.writeFileSync(histFile, JSON.stringify(newHistory, null, 4))
    } catch (e) {
        console.error(e.message)
        process.exit(1)
    }
})()
