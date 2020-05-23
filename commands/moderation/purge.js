module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const input = parseInt(args[0]);
    if (!input || input > 100 || input < 2) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    }

    try {
        let fetched = await message.channel.messages.fetch({ limit: input });
        await message.channel.bulkDelete(fetched);
        return client.send.log(message);
    } catch (error) {
        client.send.report(message, error);
        return client.send.log(message);
    }
}

module.exports.code = {
    name: "purge",
    description: "Deletes [NUMBER < 100 AND NUMBER > 2 AND AN INTEGER] messages",
    group: "moderation",
    usage: ["/PREFIX/purge [NUMBER < 100 AND NUMBER > 2 AND AN INTEGER]"],
    accessableby: "Villagers",
    aliases: ["purge", "prune", "clear"]
}