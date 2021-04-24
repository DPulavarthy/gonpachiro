module.exports.run = async (client, message, args, guild) => {
    if(!args[0]) return message.channel.send(client.embed().setTitle(`Prefixes for ${message.guild.name}`).setDescription(client.src.code(`${client.prefix}${guild.prefix !== client.prefix ? `\n${guild.prefix}` : ``}`)))
    if (args[0].toLowerCase().includes(`\\`)) return message.channel.send(client.comment(`ERROR: Prefix cannot contain a '\\'`))
    if (args[0].toLowerCase() === `reset`) args[0] = client.prefix
    if (args[0].length !== 2) return message.channel.send(client.comment(`ERROR: Prefix length can only be 2 characters`))
    client.db._guilds.updateOne({ id: message.guild.id }, { $set: { prefix: args[0].toLowerCase() } }, async (error) => {
        if (error) client.error(error)
        return message.channel.send(client.comment(`SUCCESS: The prefix has been set to ${args[0].toLowerCase()}`))
    })
}

module.exports.code = {
    title: "prefix",
    about: "Setup the prefix for Jonin",
    usage: ["%P%prefix"]
}