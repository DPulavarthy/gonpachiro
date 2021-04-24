module.exports.run = async (client, message, args) => {
    switch (args.length) {
        case 0: {
            message.channel.send(client.embed().setTitle(`${client.user.username}'s Help List`).setDescription(client.codeify(`\u279c :: ${message._guild.prefix}help ${client.commands.groups.join(`\n\u279c :: ${message._guild.prefix}help `)}`, `asciidoc`)))
            break
        }
        default: {
            if (client.commands.groups.includes(args[0])) {
                
            }
            break
        }
    }
}

module.exports.data = {
    title: `help`,
    about: `%B%'s Command list`,
    alias: [`beep`, `ding`]
}


/*
const { Collection } = require("discord.js")
const { embedify } = require("../../res/src")

module.exports.run = async (client, message, args) => {
    let groups = new Array()
    groups.cmds = new Collection()
    let groupify = prefix => client.commands.forEach(command => {
        if (!groups.includes(command.group)) groups.push(`${prefix ? `\u279c :: ${message._guild.prefix}help ` : ``}${command.group}`)
        let data = groups.cmds.get(command.group) || new Array()
        data.push(command.data.title)
        groups.cmds.set(command.group, data)
    })
    switch (args.length) {
        case 0: {
            groupify(true)
            message.channel.send(client.embed({ title: `${client.user.username}'s Help List` }).setDescription(client.codeify(groups.join(`\n`), `asciidoc`)))
            break
        }
        default: {
            groupify()
            if (groups.includes(args[0])) {
                let data = groups.cmds.get(args[0])
                let embed = client.embed()
                    .setTitle(`${client.user.username}'s Commands: ${args[0].substring(0, 1).toUpperCase()}${args[0].substring(1)}`)
                    .setDescription(client.codeify(data.length > 0 ? `\u279c :: ${message._guild.prefix}${data.join(`\n\u279c :: ${message._guild.prefix}`)}` : `ERROR :: No commands found in this group`, `asciidoc`))
                message.channel.send(embed)
            }
            else message.channel.send(client.comment(`ERROR :: No Command Group For ["${args[0]}"]`, `asciidoc`))
            break
        }
    }
}

module.exports.data = {
    title: `help`,
    about: `%B%'s Command list`,
    alias: [`beep`, `ding`]
}
*/  