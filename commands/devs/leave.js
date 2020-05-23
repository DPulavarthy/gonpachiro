module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!client.send.approve(message.author.id, `DEVELOPER`)) {
        client.send.restrict(message, 14);
        return client.send.log(message, `hiro`);
    } else {
        const guild = client.guilds.cache.get(args[0])
        if (!guild) {
            await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
            return client.send.log(message);
        }
        if (guild.id === `264445053596991498`) return message.channel.send(`Nope`)
        let reason = args.splice(1).join(" ") || `No reason provided!`;
        const embed = client.send.embed()
            .setAuthor(`${client.user.username}'s Source`, client.util.link.logo, client.util.link.support)
            .setTitle(`The owner of ${client.user.username} has requested that I leave this server`)
            .addField(`Reason: ${reason}`, `If you have any questions, join the [support server](${client.util.link.support})`, false)
            .setThumbnail(client.user.displayAvatarURL)
        let firstChannel = guild.channels.cache.filter(c => c.type === "text" && c.permissionsFor(guild.me).has("SEND_MESSAGES")).first();
        firstChannel.send(embed)
        setTimeout(async () => {
            await guild.leave().catch(err => console.log(err))
        }, 5000)
        message.channel.send(`I have left the guild: \`${guild.name}\` with the reason: \`${reason}\``)
        return client.send.log(message);
    }
}

module.exports.code = {
    name: "leave",
    description: "Leaves [GUILD_ID] with (REASON)",
    group: "devs",
    usage: ["/PREFIX/leave [GUILD_ID] (REASON)"],
    accessableby: "Developers",
    aliases: ["leave"]
}