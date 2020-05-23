module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let loading = await message.channel.send(client.send.loading()),
        user,
        member;
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

    const roles = member.roles.cache.map(role => role.toString());
    let type = user.presence.status;
    if (type === `online`) {
        type = client.emojis.cache.get(client.util.emoji.green).toString();
    } else if (type === `idle`) {
        type = client.emojis.cache.get(client.util.emoji.yellow).toString();
    } else if (type === `dnd`) {
        type = client.emojis.cache.get(client.util.emoji.red).toString();
    } else if (type === `streaming`) {
        type = client.emojis.cache.get(client.util.emoji.purple).toString();
    } else if (type === `offline`) {
        type = client.emojis.cache.get(client.util.emoji.grey).toString();
    }
    if (member.id) {
        const embed = client.send.embed()
            .setTitle(`${type} ${user.tag}`)
            .addField(`Roles[${member.roles.cache.size}]`, roles.join(` **|** `), false)
            .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
        await loading.edit(embed);
        return client.send.log(message);
    }
}

module.exports.code = {
    name: "roles",
    description: "Get the roles of [USER] / Author",
    group: "information",
    usage: ["/PREFIX/roles [USER]", "/PREFIX/roles"],
    accessableby: "Villagers",
    aliases: ["roles"]
}