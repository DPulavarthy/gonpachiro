module.exports.run = async (client, message, args) => {
    let status, user = await client.src.userlist(message, args);
    if (user.length < 1) { message.channel.send(client.src.comment(`That user was not found in ${message.guild.name}`)); return client.log(message); };
    user = await client.users.cache.get(user[0].id);
    member = await message.guild.members.cache.get(user.id);
    switch (user.presence.status.toUpperCase()) { case `ONLINE`: status = client.emoji.green; break; case `IDLE`: status = client.emoji.yellow; break; case `DND`: status = client.emoji.red; break; case `STREAMING`: status = client.emoji.purple; break; default: status = client.emoji.grey; };
    // client.database.config.findOne({ case: `data` }, async function (error, result) {
    //     if (error) { client.error(error); };
    //     let ranks = 0, about = `You are a Villager`, field = [];
    //     result.data.forEach(group => {
    //         if (group.data.includes(user.id)) {
    //             if (group.rank > ranks) {
    //                 ranks = group.rank;
    //                 about = `You are a ${client.src.clean(group.desc)}`;
    //             }
    //         }
    //     })
        field.push(`${client.arrow} Username: ${user.username}`);
        field.push(`${client.arrow} Nickname: ${member.displayName}`);
        field.push(`${client.arrow} Mention: ${user.toString()}`);
        field.push(`${client.arrow} ID: ${user.id}`);
        field.push(`${client.arrow} Owner: ${user.id === message.guild.owner.id ? `Yes` : `No`}`);
        field.push(`${client.arrow} Bot: ${user.bot ? `Yes` : `No`}`);
        field.push(`${client.arrow} Account Created: ${user.createdAt.toDateString()}`);
        field.push(`${client.arrow} Joined Server: ${member.joinedAt.toDateString()}`);
        field.push(`${client.arrow} Number of roles: ${member.roles.cache.size}`);
        field.push(`${client.arrow} Join rank: ${client.src.rank(message, user.id)}`);
        field.push(`${client.arrow} Status: ${client.emojis.cache.get(status).toString()} - ${user.presence.status}`);
        // field.push(`${client.arrow} Rank: ${about} - [${ranks}]`);
        const embed = client.embed()
            .setTitle(`${client.emojis.cache.get(status).toString()} ${user.tag}`)
            .setDescription(field)
            .setImage(user.avatarURL({ format: "png", dynamic: true, size: 2048 }))
        message.channel.send(embed);
        return client.log(message);
    // })
}

module.exports.code = {
    title: "info",
    about: "Get the info of (USER)",
    usage: ["%P%info (USER)"],
    alias: ["profile", "whois"],
}