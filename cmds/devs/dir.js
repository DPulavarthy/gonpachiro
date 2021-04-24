module.exports.run = async (client, message, args, guild) => {
    let [input, package] = [args.join(` `).toLowerCase(), require(`../../package.json`)]
    if (input.startsWith(client.prefix) || input.startsWith(guild.prefix)) input = input.substring(2)
    let command = client.commands.get(client.aliases.get(input)) || client.commands.get(input)
    if (command) return embed(`./cmds/${command.group}/${command.code.title}.js`)
    const resources = require(`fs`).readdirSync(`./res`).filter(file => file.split(`.`).pop() === `js`)
    if (resources.includes(`${input}.js`)) return embed(`./res/${input}.js`)
    else if ([package.main.substring(0, package.main.length - 3), `index`].includes(input)) return embed(`./${package.main}`)
    let [groups, field, i] = [[], [], 1]
    client.commands.forEach(command => { if (!groups.includes(command.group)) groups.push(command.group) })
    if (groups.includes(input)) {
        client.commands.forEach(command => {
            if (command.group === input) {
                field.push(`\`${i}.)\` ${command.code.title}.js`)
                i++
            }
        })
        return message.channel.send(client.embed().setAuthor(`Commands in the ${input} group`).setDescription(field.join(`\n`)))
    } else return message.channel.send(client.src.comment(`ERROR: That JS file was not found in any directory.`))
    function embed(dir) { return message.channel.send(client.comment(dir).setAuthor(`The directory for \`${args.join(` `)}\` is`)) }
}

module.exports.code = {
    title: "dir",
    about: "Get the directoy of a file/command",
    usage: ["%P%dir [COMMAND/FILE]"]
}