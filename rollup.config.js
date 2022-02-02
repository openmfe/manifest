import copy from 'rollup-plugin-copy'

const builds = []

;['manifest', 'contract'].map(name => {
    ;['js', 'cjs'].map(type => {
        const config = {
            input: `lib/${name}.js`,
            output: {
                file: `dist/${name}.${type}`
            },
            plugins: [
                copy({
                    targets: [
                        { src: 'lib/schema.json', dest: 'dist' }
                    ]
                })
            ]
        }

        if (type === "cjs") {
            config.output.format = "cjs"
            config.output.exports = "auto"
        }

        builds.push(config)
    })
})

export default builds
