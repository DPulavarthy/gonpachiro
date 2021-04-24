require(`dotenv`).config()
require(`endecodify`).startup()

Object.mergify = (main, ...subs) => {
    if (Array.isArray(main)) main.forEach(obj => subs.push(obj)), main = {}
    if (typeof main !== `object` || main === null) throw new Error(`Must pass an object`)
    for (let obj of subs) if (typeof obj !== `object` || obj === null) throw new Error(`Must pass an object`)
    for (let obj of subs) for (let attrname in obj) main[attrname] = obj[attrname]
    return main
}

module.exports = {
    start() {
        process.__client = () => {
            let { Client } = require(`discord.js`)
            setTimeout(() => delete process.__client, 1000)
            return new Client(require(`../data/storage/util.js`).client)
        }
        process.err = (err) => {
            console.log(err)
        }
    }
}