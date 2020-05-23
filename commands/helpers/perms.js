module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let checker = [
        "ADMINISTRATOR",
        "CREATE_INSTANT_INVITE",
        "ADD_REACTIONS",
        "KICK_MEMBERS",
        "BAN_MEMBERS",
        "MANAGE_CHANNELS",
        "MANAGE_GUILD",
        "VIEW_AUDIT_LOG",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "MANAGE_MESSAGES",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "MENTION_EVERYONE",
        "USE_EXTERNAL_EMOJIS",
        "CONNECT",
        "SPEAK",
        "MUTE_MEMBERS",
        "DEAFEN_MEMBERS",
        "MOVE_MEMBERS",
        "MANAGE_NICKNAMES",
        "MANAGE_ROLES",
        "MANAGE_WEBHOOKS",
        "MANAGE_EMOJIS"
    ]
    let arrow = client.emojis.cache.get(client.util.emoji.right_arrow),
        member,
        user;
    if (!args.join(" ")) {
        user = message.author;
        member = message.guild.members.cache.get(user.id);
    } else {
        if (args.join(" ") === `owner`) {
            user = message.guild.owner.user;
        } else {
            user = message.mentions.users.first() || await client.send.getUser(args.join(" "));
        }
        if (!user) return message.channel.send(`I was unable to get the user's information.`);
        member = message.guild.members.cache.get(user.id);
        if (!member) return message.channel.send(`That user isn't in this server.`);
    }

    let perms = ``;
    const embed = client.send.embed()
    checker.forEach(perm => {
        let name = format(perm);
        if (member.hasPermission(perm)) {
            perms += `${arrow} [${client.emojis.cache.get(client.util.emoji.check).toString()}]${name}\n`
        } else {
            perms += `${arrow} [${client.emojis.cache.get(client.util.emoji.cross).toString()}]${name}\n`
        }
    });
    await message.channel.send(embed.setTitle(`Permissions for ${member.displayName} in ${message.guild.name}`).setDescription(perms))
    return client.send.log(message);

    function format(perm) {
        output = perm.replace(/_/g, ` `);
        return output.substring(0, 1) + output.substring(1).toLowerCase();
    }
}

module.exports.code = {
    name: "perms",
    description: "Perms for (USER) / Author in a server",
    group: "helpers",
    usage: ["/PREFIX/perms (USERNAME)", "/PREFIX/perms"],
    accessableby: "Villagers",
    aliases: ["perms"]
}