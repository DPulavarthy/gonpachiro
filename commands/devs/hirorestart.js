module.exports.run = async (client, message, args, guilds, con) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!client.send.approve(message.author.id, `APPROVED`)) {
        client.send.restrict(message, 14);
        return client.send.log(message, `hiro`);
    } else {
        let loading = await message.react(client.emojis.cache.get(client.util.emoji.loading));
        process.exit(1);
        await loading.remove();
        await message.react(client.emojis.cache.get(client.util.emoji.check));
        return client.send.log(message, `hiro`);
    }
}

module.exports.code = {
    name: "/hirorestart",
    description: "Restart the bot",
    group: "devs",
    usage: ["/PREFIX//hirorestart"],
    accessableby: "Gonpachiro",
    aliases: ["/hirorestart"]
}