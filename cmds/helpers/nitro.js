module.exports.run = async (client, message, args, guild) => {
    if(!args[0]) return message.channel.send(client.comment(`Nitro mockup for this server is ${guild.nitro ? `enabled` : `disabled`}`))
    if (args[0].toLowerCase() === `on` || args[0].toLowerCase() === `enable`) guild.nitro = true
    if (args[0].toLowerCase() === `off` || args[0].toLowerCase() === `disable`) guild.nitro = false
    client.db._guilds.updateOne({ id: message.guild.id }, { $set: { nitro: guild.nitro } }, async (error) => {
        if (error) client.error(error)
        return message.channel.send(client.comment(`SUCCESS: The nitro mockup has been ${guild.nitro ? `enabled` : `disabled`}`))
    })
}

module.exports.code = {
    title: "nitro",
    about: "Manage the nitro feature for the server",
    usage: ["%P%nitro"]
}