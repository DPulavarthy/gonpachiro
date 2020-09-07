module.exports.run = async (client, message, args) => {
    let status, user = await client.src.userlist(message, args);
    if (user.length < 1) { message.channel.send(client.src.comment(`That user was not found in ${message.guild.name}`)); return client.log(message); };
    user = await client.users.cache.get(user[0].id);
    switch (user.presence.status.toUpperCase()) { case `ONLINE`: status = client.emoji.green; break; case `IDLE`: status = client.emoji.yellow; break; case `DND`: status = client.emoji.red; break; case `STREAMING`: status = client.emoji.purple; break; default: status = client.emoji.grey; };
    message.channel.send(client.embed().setTitle(`${client.emojis.cache.get(status).toString()} ${user.tag}`).setImage(user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 })).setDescription(user.displayAvatarURL().toLowerCase().substring(user.displayAvatarURL().lastIndexOf(`/`) + 1, user.displayAvatarURL().lastIndexOf(`/`) + 3) === `a_` ? `[GIF](${user.displayAvatarURL({ format: "gif", dynamic: true, size: 2048 })}) **|** [WEBP](${user.avatarURL({ size: 2048 })})` : `[PNG](${user.avatarURL({ format: "png", dynamic: true, size: 2048 })}) **|** [JPG](${user.avatarURL({ format: "jpg", dynamic: true, size: 2048 })}) **|** [JPEG](${user.avatarURL({ format: "jpeg", dynamic: true, size: 2048 })}) **|** [WEBP](${user.avatarURL({ format: "webp", dynamic: true, size: 2048 })})`));
    return client.log(message);
}

module.exports.code = {
    title: "pfp",
    about: "Get the profile picture of (USER)",
    usage: ["%P%pfp (USER)"],
}