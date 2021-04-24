module.exports.run = async (client, message, args, guild) => {
    let blacklist = []
    for (let i = 0; i < guild.blacklist.length; i++) {
        let channel = message.guild.channels.cache.get(guild.blacklist[i])
        blacklist.push(channel ? `\`${i + 1}.)\` ${channel.toString()}` : `\`${i + 1}.)\` #${guild.blacklist[i]}`)
    }

    if (!args[0]) return message.channel.send(client.embed().setTitle(`${message.guild.name}'s whitelisted channels`).setDescription(blacklist.join('\n')))
    // let channel = message.mentions.channels.first() || await message.guild.channels.cache.get(args[0])
    // if (!channel) return message.channel.send(client.comment(`Invalid channel provided.`))
    switch (args[0]) {
        case 'add':
            // add a channel
            break;
        case 'remove':
            // remove a channel
            break;
        case 'list':
            // send list of blacklists
            if (!args[1]) return message.channel.send(client.embed().setTitle(`${message.guild.name}'s whitelisted channels`).setDescription(blacklist.join('\n')))
                // option to remove
            break;
        case `help`:
            // lists all commands for bl 
            break;
    }
}

module.exports.code = {
    title: "blacklist",
    about: "Restricts  Jonin to a specific channel",
    usage: ["%P%blacklist [CHANNEL]"],
    alias: ["bl"]
}