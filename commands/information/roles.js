module.exports.run = async (client, message, args) => {
    let status, user = await client.src.userlist(message, args), loading = await message.channel.send(client.src.loading());
    if (user.length < 1) { message.channel.send(client.src.comment(`That user was not found in ${message.guild.name}`)); return client.log(message); };
    user = await client.users.cache.get(user[0].id);
    member = await message.guild.members.cache.get(user.id);
    switch (user.presence.status.toUpperCase()) { case `ONLINE`: status = client.emoji.green; break; case `IDLE`: status = client.emoji.yellow; break; case `DND`: status = client.emoji.red; break; case `STREAMING`: status = client.emoji.purple; break; default: status = client.emoji.grey; };
    const embed = client.embed()
        .setTitle(`${client.emojis.cache.get(status).toString()} ${user.tag}`)
        .setDescription(client.src.crop(`**Roles[${member.roles.cache.size}]**\n${member.roles.cache.map(role => role.toString()).join(` **|** `)}`, `description`))
        .setThumbnail(user.avatarURL({ format: "png", dynamic: true, size: 2048 }))
    setTimeout(async () => { loading.edit(embed); }, 1000);
    return client.log(message);
}

module.exports.code = {
    title: "roles",
    about: "Get the roles of (USER)",
    usage: ["%P%roles (USER)"],
}