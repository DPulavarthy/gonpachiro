module.exports.run = async (client, message, args) => {
    let user = await client.src.userlist(message, args), field = [];
    if (!args.join(` `)) { user = [client.users.cache.get(client.user.id)]; } else if (user.length < 1) { message.channel.send(client.src.comment(`That user was not found in ${message.guild.name}`)); return client.log(message); };
    user = await client.users.cache.get(user[0].id);
    if (!user.bot) { message.channel.send(client.src.comment(`That user is not a bot`)); return client.log(message); };
    field.push(`${client.arrow} [Invite with all permissions](https://discord.com/oauth2/authorize?client_id=${user.id}&permissions=2137517567&scope=bot)`);
    field.push(`${client.arrow} [Invite as administrator](https://discord.com/oauth2/authorize?client_id=${user.id}&permissions=8&scope=bot)`);
    field.push(`${client.arrow} [Invite as a moderator](https://discord.com/oauth2/authorize?client_id=${user.id}&permissions=1543892167&scope=bot)`);
    field.push(`${client.arrow} [Invite with normal permissions](https://discord.com/oauth2/authorize?client_id=${user.id}&permissions=67488833&scope=bot)`);
    field.push(`${client.arrow} [Invite with no permissions](https://discord.com/oauth2/authorize?client_id=${user.id}&permissions=0&scope=bot)`);
    message.channel.send(client.embed().setAuthor(`${user.username}'s Invite Links`, client.util.link.logo, client.util.link.support).setThumbnail(user.avatarURL({ format: "png", dynamic: true, size: 2048 })).setDescription(field));
    return client.log(message);
}

module.exports.code = {
    title: "invite",
    about: "Invite links for bots",
    usage: ["%P%invite"],
}