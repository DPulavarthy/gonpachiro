module.exports.run = async (client, message, args, prefix) => {
    if (!args.join(` `)) { return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    let user = message.mentions.users.first(), role = message.mentions.roles.first() || await client.src.getRole(message.guild.roles.cache, args.slice(1).join(` `));
    if (!message.guild.members.cache.get(message.author.id).hasPermission(`MANAGE_ROLES_OR_PERMISSIONS`)) { return client.src.require(message, `You do not have the following permission: MANAGE_ROLES_OR_PERMISSIONS`, `01`); };
    if (!message.guild.members.cache.get(client.user.id).hasPermission(`MANAGE_ROLES_OR_PERMISSIONS`)) { return client.src.require(message, `I do not have the following permission: MANAGE_ROLES_OR_PERMISSIONS`, `01`); };
    if (!user) { return client.src.require(message, `You have not included a user to remove a role`, `12`); };
    let member = message.guild.members.cache.get(user.id);
    if (!member) { return client.src.require(message, `That user is not in this server`, `09`); };
    if (!role) { return client.src.require(message, `You have not included a role`, `13`); };
    if (!member.roles.cache.has(role.id)) { return client.src.require(message, `User does not have that role`, `15`); };
    let field = [];
    field.push(`${client.arrow} Role Name: ${role.name}`);
    field.push(`${client.arrow} Role ID: ${role.id}`);
    field.push(`${client.arrow} User Name: ${user.tag}`);
    field.push(`${client.arrow} User ID: ${user.id}`);
    field.push(`${client.arrow} Author Name: ${message.author.tag}`);
    field.push(`${client.arrow} Author ID: ${message.author.id}`);
    try {
        await member.roles.remove(role);
        let dm = true;
        try { await client.users.cache.get(user.id).send(client.src.embed().setTitle(`Your role has been removed!`).setDescription(field)); }
        catch (error) { dm = false; }
        message.channel.send(client.src.embed().setTitle(`Role Removal Successful`).setDescription(`${field.join(`\n`)}\n${client.arrow} Notified User: ${dm ? `Yes` : `No`}`));
        return client.src.log(message);
    } catch (error) {
        client.error(error);
        message.channel.send(client.src.embed().setTitle(`Role Removal Failed`).setDescription(`${field.join(`\n`)}\n${client.arrow} Error: ${error}`));
        return client.src.log(message);
    }
}

module.exports.code = {
    title: "removerole",
    about: "Removes role from user",
    usage: ["%P%removerole [USER] [ROLE or ROLE NAME]"],
    alias: ["remr", "remrole"],
}