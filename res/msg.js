const { client } = require("../data/storage/util")

module.exports = async (message) => {
    let [time, guild, author] = [new Date().getTime(), await message.client.db._guilds.findOne({ id: message.guild.id }), message.client.db._premium.findOne({ id: message.author.id })]
    if (!guild) return message.client.db._guildAdd(message, true)
    if (message.content.toLowerCase() === `${message.client.user.username.toLowerCase()}?` || (message.channel.type !== `dm` && message.content.toLowerCase() === `${message.guild.members.cache.get(message.client.user.id).displayName.toLowerCase()}?`)) return message.channel.send(`${message.client.user.username} online, running master prefix \`${message.client.prefix}\``)
    if (message.content.toLowerCase().startsWith(message.client.prefix)) {
        let args = message.content.slice(message.client.prefix.length).trim().split(/ +/g)
        args.command = args[0]
        Object.mergify(message, { _guild: guild, _author: author })
        let command = message.client.commands.find(args.command)
        if (command) {
            args.shift()
            command.run(message.client, message, args).then(() => message.client.logger(message, time))
        }
    }
}