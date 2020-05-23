module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let loading = await message.channel.send(client.send.loading()),
        arrow = client.emojis.cache.get(client.util.emoji.right_arrow),
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

    function getJoinRank(ID, guild) {
        let arr = guild.members.cache.array(),
            pos = 0;
        arr.sort((a, b) => a.joinedAt - b.joinedAt);
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == ID) pos = i + 1;
        }
        if (pos % 10 === 1 && pos != 11) {
            pos = pos.toString() + `st`;
        } else if (pos % 10 == 2 && pos != 12) {
            pos = pos.toString() + `nd`;
        } else if (pos % 10 == 3 && pos != 13) {
            pos = pos.toString() + `rd`;
        } else {
            pos = pos.toString() + `th`;
        }
        return pos;
    }

    if (member.id) {
        const embed = client.send.embed()
            .setTitle(type + " " + user.tag)
            .setDescription(`${arrow} Username: ${user.username}\n${arrow} Nickname: ${member.displayName}\n${arrow} ID: ${user.id}\n${arrow} Owner: ${user.id === message.guild.owner.id ? `Yes` : `No`}\n${arrow} Account Created: ${user.createdAt.toDateString()}\n${arrow} Joined Server: ${member.joinedAt.toDateString()}\n${arrow} Number of roles: ${member.roles.cache.size}\n${arrow} Join rank: ${getJoinRank(member.id, member.guild)}\n${arrow} Status: ${type} - ${user.presence.status}\n${arrow} Approved(${client.config.prefix}/hiro): ${client.send.approve(user.id, `approved`) ? `Yes` : `No`}\n${arrow} Bot: ${user.bot ? `Yes` : `No`}\n${arrow} Owner of ${client.user.username}: ${client.send.approve(user.id, `owner`) ? `Yes` : `No`}`)
            .setImage(user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
        await loading.edit(embed);
        return client.send.log(message);
    }
}

module.exports.code = {
    name: "info",
    description: "Get the info of (USER) / Author",
    group: "information",
    usage: ["/PREFIX/info (USER)", "/PREFIX/info"],
    accessableby: "Villagers",
    aliases: ["info", "profile", "whois"]
}