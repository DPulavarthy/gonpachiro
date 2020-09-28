module.exports.run = async (client, message, args, prefix) => {
    let user = message.mentions.users.first();
    if (!user) { return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    let member = message.guild.members.cache.get(user.id);
    if (!member) { return client.src.require(message, `Mentioned a user not in the server`, `09`); };
    if (!message.guild.members.cache.get(message.author.id).hasPermission(`BAN_MEMBERS`)) { return client.src.require(message, `You do not have the following permission: BAN_MEMBERS`, `01`); };
    if (!message.guild.members.cache.get(client.user.id).hasPermission(`BAN_MEMBERS`)) { return client.src.require(message, `I do not have the following permission: BAN_MEMBERS`, `01`); };
    if (!user.id === message.guild.owner.id) { return client.src.require(message, `Cannot ban server owner`, `07`); };
    if (!member.bannable) { return client.src.require(message, `Member cannot be banned\n(Make sure ${client.user.username}'s role is higher than the one you want to ban)`, `02`); };
    if (user.id === message.author.id) { return client.src.require(message, `You cannot ban yourself`, `07`); };
    let field = [], reason = args.slice(1).join(` `);
    field.push(`${client.arrow} Username: ${user.tag}`);
    field.push(`${client.arrow} ID: ${user.id}`);
    field.push(`${client.arrow} Triggered by: ${message.author.tag}`);
    field.push(`${client.arrow} Triggered ID: ${message.author.id}`);
    field.push(`${client.arrow} Server Name: ${message.guild.name}`);
    field.push(`${client.arrow} Server ID: ${message.guild.id}`);
    field.push(`${client.arrow} Reason: ${reason || `N/A`}`);
    try {
        member.ban().then(async () => {
            let dm = true;
            try { await client.users.cache.get(user.id).send(client.embed().setTitle(`You have been Banned!`).setDescription(field)); }
            catch (error) { dm = false; }
            await message.channel.send(client.embed().setTitle(`User Ban Successful`).setDescription(`${field.join(`\n`)}\n${client.arrow} Notified User: ${dm ? `Yes` : `No`}`));
            return client.log(message);
        });
    } catch (error) {
        client.error(error);
        await message.channel.send(client.embed().setTitle(`User Ban Failed`).setDescription(`${field.join(`\n`)}\n${client.arrow} Error: ${error}`));
        return client.log(message);
    }
}

module.exports.code = {
    title: "ban",
    about: "Bans [USER] from guild",
    usage: ["%P%ban [USER] (REASON)"],
}
