module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }
    let user;
    if (!args.join(" ")) {
        user = message.author;
    } else {
        if (args.join(" ").toLowerCase() === `owner`) {
            user = message.guild.owner.user;
        } else {
            user = message.mentions.users.first() || await client.send.getUser(args.join(" "));
        }
        if (!user) return message.channel.send(`I was unable to get the user's information.`);
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
    const embed = client.send.embed()
        .setTitle(type + " " + user.tag)
        .setDescription(`[PNG](${user.avatarURL({ format: "png", dynamic: true, size: 2048 })}) **|** [JPG](${user.avatarURL({ format: "jpg", dynamic: true, size: 2048 })}) **|** [JPEG](${user.avatarURL({ format: "jpeg", dynamic: true, size: 2048 })}) **|** [WEBP](${user.avatarURL({ format: "webp", dynamic: true, size: 2048 })})`)
        .setImage(user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
    await message.channel.send(embed);
    return client.send.log(message);
}

module.exports.code = {
    name: "pfp",
    description: "Get the profile picture of (USER) / Author",
    group: "information",
    usage: ["/PREFIX/pfp (USER)", "/PREFIX/pfp"],
    accessableby: "Villagers",
    aliases: ["pfp"]
}