let [{ readdirSync, readFile }, { Collection }] = [require(`fs`), require(`discord.js`)]

module.exports = async (client, time) => {
    let broken = []
    client.lines = 0
    client.cooldowns = new Collection()
    client.commands = new Collection()
    client.aliases = new Collection()
    console.log(`[SYSTEM]: ${require(`./src.js`).time(time)} Loading Commands!`.system)
    for (let main of [`./res/`, `./`]) {
        for (let file of readdirSync(main).filter(file => file.split(`.`).pop() === `js`)) {
            readFile(`${main}${file}`, `utf8`, function (error, code) {
                if (error) require(`./src.js`).error(error)
                client.lines += require(`sloc`)(code, `js`).total
            })
        }
    }
    for await (let dir of readdirSync(`./cmds/`)) {
        const cmds = readdirSync(`./cmds/${dir}/`).filter(file => file.split(`.`).pop() === `js`)
        for await (let file of cmds) {
            let pull = require(`../cmds/${dir}/${file}`)
            readFile(`./cmds/${dir}/${file}`, `utf8`, async (error, code) => {
                if (error) require(`./src.js`).error(error)
                client.lines += require(`sloc`)(code, `js`).total
            })
            if (pull.code && pull.code.title) {
                client.cooldowns.set(pull.code.title, new Collection())
                client.commands.set(pull.code.title, { run: pull.run, code: pull.code, group: dir })
                if (pull.code.alias && pull.code.alias.length > 0) pull.code.alias.forEach(alias => client.aliases.set(alias, pull.code.title))
            } else broken.push(file)
        }
    }
    console.log(`${`[SYSTEM]: ${require(`./src.js`).time(time)} Successfully Loaded ${client.commands.size}/${client.commands.size + broken.length} Commands!`.system}${broken.length > 0 ? `\n[ERROR!]: [-----] Failed To Load: ${broken.join(`, `)}`.errors : ``}`)
}