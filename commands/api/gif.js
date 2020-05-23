module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let loading = await message.channel.send(client.send.loading()),
        input = args.join(" ");

    if (!input) {
        await loading.delete();
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    } else {
        let { body } = await require(`superagent`).get(`http://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(input)}&api_key=${client.util.api.gif}&limit=100`).catch(error => client.send.report(message, error));
        if (!body) {
            await loading.edit(client.send.error(`No GIFs found for ${input}`));
            return client.send.log(message);
        }
        let random = body.data[Math.floor(Math.random() * (body.data || 0).length)];
        if (!random) {
            await loading.edit(client.send.error(`No GIFs found for ${input}`));
            return client.send.log(message);
        }
        const embed = client.send.embed(`https://giphy.com/`)
            .setTitle(random.title.toUpperCase())
            .setURL(random.url)
            .setImage(random.images.original.url)
        await loading.edit(embed);
        return client.send.log(message, random.url);
    }
}

module.exports.code = {
    name: "gif",
    description: "A random gif related to [TEXT] (Will be updated to anime only soon!)",
    group: "api",
    usage: ["/PREFIX/gif [TEXT]"],
    accessableby: "Villagers",
    aliases: ["gif"]
}