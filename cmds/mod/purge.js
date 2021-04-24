module.exports.run = async (client, message, args, guild) => {
    if (!args.join(` `)) return client.src.invalid(message, module.exports.code.title, guild)
    if (!message.guild.members.cache.get(client.user.id).hasPermission(`MANAGE_MESSAGES`)) return message.channel.send(client.comment(`CODE 01: I do not have the following permission: MANAGE_MESSAGES`))
    if (!message.guild.members.cache.get(message.author.id).hasPermission(`MANAGE_MESSAGES`)) return message.channel.send(client.comment(`CODE 01: You do not have the following permission: MANAGE_MESSAGES`))
    let input = parseInt(args.join(` `))
    if (!input || input > 100 || input < 2) return client.src.invalid(message, module.exports.code.title, guild)
    try {
        let fetched = await message.channel.messages.fetch({ limit: input })
        return message.channel.bulkDelete(fetched)
    } catch (error) {
        client.error(error)
        return message.channel.send(client.comment(`ERROR: ${error}`))
    }
}

module.exports.code = {
    title: "purge",
    about: "Deletes [NUMBER < 100 AND NUMBER > 2 AND AN INTEGER] messages",
    usage: ["%P%purge [NUMBER < 100 AND NUMBER > 2 AND AN INTEGER]"],
    alias: ["prune", "clear"]
}