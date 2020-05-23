module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const user = message.mentions.users.first();

    if (!user) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    }

    const member = message.guild.member(user);

    if (!member) {
        client.send.missing(message, `Mentioned a user not in the server`, `09`);
        return client.send.log(message);
    }

    if (!message.guild.members.cache.get(message.author.id).hasPermission(`BAN_MEMBERS`)) {
        client.send.perms(message, `BAN_MEMBERS`, `01`);
        return client.send.log(message);
    }

    if (user.id === message.guild.owner.id) {
        client.send.missing(message, `Cannot ban server owner`, `07`);
        return client.send.log(message);
    }

    if (!member.bannable) {
        client.send.missing(message, `Member cannot be banned\n(Make sure ${client.user.username}'s role is higher than the one you want to ban)`, `02`);
        return client.send.log(message);
    }

    if (user.id === message.author.id) {
        client.send.missing(message, `You cannot ban yourself`, `07`);
        return client.send.log(message);
    }

    try {
        member.ban().then(async () => {
            let reason = args.slice(1).join(" "),
                field = ``;
            if (!reason) {
                reason = `No reason provided`;
            }
            field += `${client.arrow} Username: ${user.tag}\n`;
            field += `${client.arrow} ID: ${user.id}\n`;
            field += `${client.arrow} Triggered by: ${message.author.tag}\n`;
            field += `${client.arrow} Triggered ID: ${message.author.id}\n`;
            field += `${client.arrow} Server Name: ${message.guild.name}\n`;
            field += `${client.arrow} Server ID: ${message.guild.id}\n`;
            field += `${client.arrow} Reason: ${reason}\n`;
            const embed = client.send.embed()
                .setTitle(`User Banned!`)
                .setDescription(field)
            await message.channel.send(embed)
            await client.users.cache.get(user.id).send(embed.setTitle(`You have been Banned!`));
            return client.send.log(client, message);
        });
    } catch (error) {
        client.send.report(message, error);
        return client.send.log(message);
    }
}

module.exports.code = {
    name: "ban",
    description: "Bans [USER] from guild",
    group: "moderation",
    usage: ["/PREFIX/ban [USER] (REASON)"],
    accessableby: "Villagers with BAN_MEMBERS permission",
    aliases: ["ban"]
}