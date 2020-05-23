module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let reason = args.slice(1).join(" ");
    client.unbanReason = reason;
    client.unbanAuth = message.author;
    let input = args[0];

    if (!input) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    }

    if (!message.guild.members.cache.get(message.author.id).hasPermission(`BAN_MEMBERS`)) {
        client.send.perms(message, `BAN_MEMBERS`, `01`);
        return client.send.log(message);
    }

    let user = client.users.cache.get(input);

    if (!user) {
        message.channel.send(`You must supply a User Resolvable, such as a proper user id.`)
        return client.send.log(message)
    }

    try {
        const banList = await message.guild.fetchBans();
        const bannedUser = banList.find(u => u.id === user.id);
        if (!bannedUser) {
            message.channel.send(`${user.tag} is not banned.`);
            return client.send.log(message)
        }
    } catch (error) {
        client.send.report(message, error);
        return client.send.log(message);
    }

    try {
        let reason = args.slice(1).join(" "),
            field = ``;
        if (!reason) {
            reason = `No reason provided`;
        }
        message.guild.members.unban(user, { reason: reason.length < 1 ? `No reason supplied.` : reason })
        field += `${client.arrow} Username: ${user.tag}\n`;
        field += `${client.arrow} ID: ${user.id}\n`;
        field += `${client.arrow} Triggered by: ${message.author.tag}\n`;
        field += `${client.arrow} Triggered ID: ${message.author.id}\n`;
        field += `${client.arrow} Server Name: ${message.guild.name}\n`;
        field += `${client.arrow} Server ID: ${message.guild.id}\n`;
        field += `${client.arrow} Reason: ${reason}\n`;
        const embed = client.send.embed()
            .setTitle(`User Unbanned!`)
            .setDescription(field)
        await message.channel.send(embed)
        let invite = await message.channel.createInvite(
            {
                maxAge: 0, // maximum time for the invite, in milliseconds
                maxUses: 1 // maximum times it can be used
            },
            `Sent to ${user.tag} after being unbanned by ${message.author.tag}`
        ).catch(console.log);
        await client.users.cache.get(user.id).send(embed.setTitle(`You have been Unbanned!`).addField(`Join back`, `[Click Here!](${invite})`, false));
        return client.send.log(message);
    } catch (error) {
        client.send.report(message, error);
        return client.send.log(message);
    }
}

module.exports.code = {
    name: "unban",
    description: "Unban a banned user",
    group: "moderation",
    usage: ["/PREFIX/unban [USER]"],
    accessableby: "Villagers with BAN_MEMBERS permission",
    aliases: ["unban"]
}