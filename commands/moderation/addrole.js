module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!args.join(" ")) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    }

    let user = message.mentions.users.first(),
        role = message.mentions.roles.first() || await client.send.getRole(message , args.slice(1).join(" "));

    if (!message.guild.members.cache.get(message.author.id).hasPermission(`MANAGE_ROLES_OR_PERMISSIONS`)) {
        client.send.perms(message, `MANAGE_ROLES_OR_PERMISSIONS`, `01`);
        return client.send.log(message);
    }
    if (!user) {
        client.send.missing(message, `You have not included a user to add a role to`, `12`);
        return client.send.log(message);
    }
    let member = message.guild.member(user.id);

    if (!member) {
        client.send.missing(message, `That user is not in this server`, `09`);
        return client.send.log(message);
    }
    if (!role) {
        client.send.missing(message, `You have not included a role`, `13`);
        return client.send.log(message);
    }

    if (member.roles.cache.has(role.id)) {
        client.send.missing(message, `User already has the role`, `15`);
        return client.send.log(message);
    }

    try {
        await member.roles.add(role);
        let field = ``;
        field += `${client.arrow} Role Name: ${role.name}\n`;
        field += `${client.arrow} Role ID: ${role.id}\n`;
        field += `${client.arrow} User Name: ${user.tag}\n`;
        field += `${client.arrow} User ID: ${user.id}\n`;
        field += `${client.arrow} Triggered by: ${message.author.tag}\n`;
        field += `${client.arrow} Triggered ID: ${message.author.id}\n`;
        const embed = client.send.embed()
            .setTitle(`Role addition successful`)
            .setDescription(field)
        message.channel.send(embed);
        return client.send.log(message);
    } catch (error) {
        client.send.report(message, error);
        return client.send.log(message);
    }
}

module.exports.code = {
    name: "addrole",
    description: "Adds a role to a user",
    group: "moderation",
    usage: ["/PREFIX/addrole [USER] [ROLE or ROLE NAME]"],
    accessableby: "Villagers with MANAGE ROLES OR PERMISSIONS permission",
    aliases: ["addrole", "addr"]
}