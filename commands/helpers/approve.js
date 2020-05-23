module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let user;
    if (!args.join(" ")) {
        user = message.author;
    } else {
        if (args.join(" ") === `owner`) {
            user = message.guild.owner.user;
        } else {
            user = message.mentions.users.first() || await client.send.getUser(args.join(" "));
        }
        if (!user) return message.channel.send(`I was unable to get the user's information.`);
    }
    await message.channel.send(client.send.approve(user.id).setTitle(message.guild.members.cache.get(user.id).displayName + `,`));
    return client.send.log(message);
}

module.exports.code = {
    name: "approve",
    description: "Perms for user regarding /BOT/",
    group: "helpers",
    usage: ["/PREFIX/jonin?"],
    accessableby: "Villagers",
    aliases: ["jonin?"]
}