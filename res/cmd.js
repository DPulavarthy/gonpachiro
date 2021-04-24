let [{ readdirSync }, { Collection }, { timeify }] = [require(`fs`), require(`discord.js`), require(`./src.js`)]

module.exports = (client, time) => {
    client.commands = new Collection()
    client.commands.aliases = new Collection()
    client.commands.find = require(`./src.js`).commandify
    client.commands.broken = new Array()
    client.commands.groups = new Array()
    console.log(`[SYSTEM]: ${timeify(time)} Starting Up!`)
    for (let dir of readdirSync(`./src/`)) {
        client.commands.groups.push(dir)
        let cmds = readdirSync(`./src/${dir}/`).filter(file => file.split(`.`).pop() === `js`)
        for (let file of cmds) {
            let pull = require(`../src/${dir}/${file}`)
            if (pull.data && pull.data.title === file.substring(0, file.length - 3)) {
                client.commands.set(pull.data.title, Object.mergify(pull, { group: dir, cooldown: new Array() }))
                if (pull.data.alias && pull.data.alias.length > 0) pull.data.alias.forEach(alias => client.commands.aliases.set(alias, pull.data.title))
            } else client.commands.broken.push(file)
        }
    }
    console.log(`[SYSTEM]: ${timeify(time)} Successfully Loaded ${client.commands.size}/${client.commands.size + client.commands.broken.length} Commands!${client.commands.broken.length > 0 ? `\n[ERROR!]: ${timeify()} Failed To Load: ${client.commands.broken.join(`, `)}` : ``}`)
}