module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (message.guild.members.cache.get(message.author.id).hasPermission(`MANAGE_NICKNAMES`)) {
        const input = args.join(" ");
        if (!input) {
            await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
            return client.send.log(message);
        } else if (input.toLowerCase() === `r`) {
            await message.guild.members.cache.get(client.user.id).setNickname(client.user.username);
            await message.channel.send(`${client.user.username}'s nickname has been reset`);
            return client.send.log(message);
        } else {
            await message.guild.members.cache.get(client.user.id).setNickname(input);
            await message.react(client.emojis.cache.get(client.util.emoji.check));
            return client.send.log(message);
        }
    } else {
        client.send.perms(message, `MANAGE_NICKNAMES`, `01`);
        return client.send.log(message);
    }
}

module.exports.code = {
    name: "nick",
    description: "Change client's nickname",
    group: "moderation",
    usage: ["/PREFIX/nick [r or TEXT]"],
    accessableby: "Villagers with MANAGE_NICKNAMES permission",
    aliases: ["nick"]
}