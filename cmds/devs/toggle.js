module.exports.run = async (client, message, args, guild) => {
    if (!args.join(` `) || !args[1]) return client.src.invalid(message, module.exports.code.title, guild)
    client.db._data.findOne({ case: module.exports.code.title }, async function (error, result) {
        if (error) client.error(error)
        if (!result) return client.src.create(client.db._data, { case: `toggle`, data: [] }, message, guild)
        let [input, disable] = [args[0], false]
        if (args[1].toUpperCase() === `-OFF` || args[1].toUpperCase() === `-DOWN`) disable = true
        let command = client.commands.get(client.aliases.get(input)) || client.commands.get(input)
        if (command) {
            if (disable) {
                if (result.data.includes(command.code.title)) return message.channel.send(client.comment(`Command already disabled.`))
                if (command.code.title === module.exports.code.title) return message.channel.send(client.comment(`I stopped running this cause if it ran, you're fucked`))
                result.data.push(command.code.title)
                client.db._data.updateOne({ case: module.exports.code.title }, { $set: { data: result.data } }, async (error) => {
                    if (error) client.error(error)
                })
                return message.channel.send(client.comment(`SUCCESS: Command Disabled`))
            }
            else {
                if (!result.data.includes(command.code.title)) return message.channel.send(client.comment(`Command not disabled.`))
                result.data = result.data.filter(name => name !== command.code.title)
                client.db._data.updateOne({ case: module.exports.code.title }, { $set: { data: result.data } }, async (error) => {
                    if (error) client.error(error)
                })
                return message.channel.send(client.comment(`SUCCESS: Command Enabled`))
            }
        } else return message.channel.send(client.comment(`ERROR: That command file / group was found`))
    })
}

module.exports.code = {
    title: "toggle",
    about: "Globally enable or disable commands",
    usage: ["%P%toggle [COMMAND] [-ON OR -OFF]"],
    alias: ["global"]
}
