module.exports.run = async (client, message, args) => {
    let user = await client.src.userlist(message, args), perms = [];
    if (user.length < 1) { message.channel.send(client.src.comment(`That user was not found in ${message.guild.name}`)); return client.log(message); };
    user = await client.users.cache.get(user[0].id);
    member = await message.guild.members.cache.get(user.id);
    let checker = [`ADMINISTRATOR`, `CREATE_INSTANT_INVITE`, `ADD_REACTIONS`, `KICK_MEMBERS`, `BAN_MEMBERS`, `MANAGE_CHANNELS`, `MANAGE_GUILD`, `VIEW_AUDIT_LOG`, `VIEW_CHANNEL`, `SEND_MESSAGES`, `MANAGE_MESSAGES`, `ATTACH_FILES`, `READ_MESSAGE_HISTORY`, `MENTION_EVERYONE`, `USE_EXTERNAL_EMOJIS`, `CONNECT`, `SPEAK`, `MUTE_MEMBERS`, `DEAFEN_MEMBERS`, `MOVE_MEMBERS`, `MANAGE_NICKNAMES`, `MANAGE_ROLES`, `MANAGE_WEBHOOKS`, `MANAGE_EMOJIS`];
    checker.forEach(perm => { if (member.hasPermission(perm)) { perms.push(`${client.arrow} [${client.emojis.cache.get(client.util.emoji.check).toString()}]${format(perm)}`); } else { perms.push(`${client.arrow} [${client.emojis.cache.get(client.util.emoji.cross).toString()}]${format(perm)}`); }; });
    message.channel.send(client.embed().setAuthor(`Permissions for ${member.displayName} in ${message.guild.name}`).setDescription(perms.join(`\n`)));
    return client.log(message);
    function format(perm) { output = perm.replace(/_/g, ` `); return `${output.substring(0, 1)}${output.substring(1).toLowerCase()}`; };
}

module.exports.code = {
    title: "perms",
    about: "Perms for (USER) in a server",
    usage: ["%P%perms (USER)"],
}