module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let field = ``,
        user;
    if (!args.join(" ")) {
        user = client.user;
    } else {
        user = message.mentions.users.first() || await client.send.getUser(args.join(" "));
    }
    if (!user.bot) {
        return message.channel.send(`Mentioned user is not a bot`);
    }

    field += `${client.arrow} [Invite with all permissions](https://discordapp.com/oauth2/authorize?client_id=${user.id}&permissions=2137517567&scope=bot)\n`;
    field += `${client.arrow} [Invite as administrator](https://discordapp.com/api/oauth2/authorize?client_id=${user.id}&permissions=8&scope=bot)\n`;
    field += `${client.arrow} [Invite as a moderator](https://discordapp.com/api/oauth2/authorize?client_id=${user.id}&permissions=1543892167&scope=bot)\n`;
    field += `${client.arrow} [Invite with normal permissions](https://discordapp.com/api/oauth2/authorize?client_id=${user.id}&permissions=67488833&scope=bot)\n`;
    field += `${client.arrow} [Invite with no permissions](https://discordapp.com/oauth2/authorize?client_id=${user.id}&permissions=0&scope=bot)\n`;

    const embed = client.send.embed()
        .setAuthor(`${user.username}'s Invite Links`, client.util.link.logo, client.util.link.support)
        .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
        .setDescription(field)
    await message.channel.send(embed);
    return client.send.log(message);
}

module.exports.code = {
    name: "invite",
    description: "Invite links for bots",
    group: "helpers",
    usage: ["/PREFIX/invte"],
    accessableby: "Villagers",
    aliases: ["invite"]
}