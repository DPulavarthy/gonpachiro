module.exports.run = async (client, message, args, prefix) => {
    if (!args.join(` `)) { return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    if (!message.guild.members.cache.get(client.user.id).hasPermission(`MANAGE_MESSAGES`)) { return client.src.require(message, `I do not have the following permission: MANAGE_MESSAGES`, `01`); };
    if (!message.guild.members.cache.get(message.author.id).hasPermission(`MANAGE_MESSAGES`)) { return client.src.require(message, `You do not have the following permission: MANAGE_MESSAGES`, `01`); };
    const input = parseInt(args.join(` `));
    if (!input || input > 100 || input < 2) { return client.src.invalid(message, client.src.clean(module.exports.code.usage[0]), client.src.clean(module.exports.code.description)); };
    try {
        let fetched = await message.channel.messages.fetch({ limit: input });
        await message.channel.bulkDelete(fetched);
        return client.src.log(message);
    } catch (error) {
        client.error(error);
        message.channel.send(`ERROR: ${error}`)
        return client.src.log(message);
    }
}

module.exports.code = {
    title: "purge",
    about: "Deletes [NUMBER < 100 AND NUMBER > 2 AND AN INTEGER] messages",
    group: "moderation",
    usage: ["%P%purge [NUMBER < 100 AND NUMBER > 2 AND AN INTEGER]"],
    alias: ["prune", "clear"],
    notes: "MANAGE_MESSAGES Permission for purging more than 10 messages",
}