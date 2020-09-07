module.exports.run = async (client, message, args) => {
    let field = [], user = await client.src.userlist(message, args);
    if (user.length < 1) { message.channel.send(client.src.comment(`That user was not found in ${message.guild.name}`)); return client.log(message); };
    user = await client.users.cache.get(user[0].id);
    switch (user.presence.status.toUpperCase()) { case `ONLINE`: status = client.emoji.green; break; case `IDLE`: status = client.emoji.yellow; break; case `DND`: status = client.emoji.red; break; case `STREAMING`: status = client.emoji.purple; break; default: status = client.emoji.grey; };
    client.database.config.findOne({ case: `data` }, async function (error, result) {
        if (error) { client.src.error(error); };
        if (!result) { return client.src.db(message, `data`, client.function.data(), null, client.database.config); };
        for (let group of result.data) { if (group.data.includes(user.id)) { field.push(`You are a ${client.src.clean(group.desc)}`); }; };
        message.channel.send(client.embed().setTitle(field.length > 0 ? `You are an approved member of ${client.user.username}, here ${field.length === 1 ? `is your position` : `are your positions`}.` : `You are not an approved member of ${client.user.username}, you can be one by [donating to ${client.user.username}](${client.util.link.donate}).`).setDescription(client.src.code(field.join(`\n`)) || null));
        return client.log(message);
    })
}

module.exports.code = {
    title: "approved",
    about: "get the user's rank on %B%",
    usage: ["%P%approved (USER)"],
    alias: [`jonin?`, `rank`],
    dm: true,
}