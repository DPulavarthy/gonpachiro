module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const role = message.mentions.roles.first() || await send.getRole(client, args.join(" "), message);

    if (!role) {
        return message.reply('please enter a valid role.');
    }
    const permsObj = role.permissions.serialize();
    const permissions = Object.keys(permsObj).filter(perm => permsObj[perm]);
    const roleEmbed = client.send.embed()
        .setThumbnail(`http://www.singlecolorimage.com/get/${role.hexColor.substring(1)}/100x100`)
        .setTitle('Role Info')
        .addField(':arrow_right: Name', role.name, true)
        .addField(':arrow_right: ID', role.id, true)
        .addField(':arrow_right: Creation Date', role.createdAt.toDateString(), true)
        .addField(':arrow_right: Hoisted', role.hoist ? 'Yes' : 'No', true)
        .addField(':arrow_right: Mentionable', role.mentionable ? 'Yes' : 'No', true)
        .addField(':arrow_right: Permissions', permissions.join(' | ') || 'None')
    message.channel.send(roleEmbed).catch(error => send.report(client, message, `Unknown`, error));
    send.log(client, message);
    return;
}

module.exports.code = {
    name: "roleinfo",
    description: "Information about [ROLE]",
    group: "information",
    usage: ["/PREFIX/roleinfo [ROLE]"],
    accessableby: "Villagers",
    aliases: ["roleinfo", "ri"]
}