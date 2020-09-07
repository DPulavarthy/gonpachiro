module.exports.run = async (client, message, args, prefix) => {
    let loading = await message.channel.send(client.src.loading());
    if (!args.join(` `)) { loading.delete(); return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    else {
        let { body } = await require(`superagent`).get(`http://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(args.join(` `))}&api_key=${client.key.gif}&limit=50`).catch(error => { loading.delete(); return client.src.report(message, error); });
        let random = body.data[Math.floor(Math.random() * (body.data || 0).length)];
        if (!random) { loading.edit(client.src.embed().setTitle(client.src.comment(`GIF not found for ${args.join(` `)}`))); return client.src.log(message); };
        setTimeout(async () => { loading.edit(client.src.embed(`https://giphy.com/`).setAuthor(random.title.toUpperCase(), ``, random.url).setImage(random.images.original.url)); }, 1000);
        return client.src.log(message, random.url);
    }
}

module.exports.code = {
    title: "gif",
    about: "A random gif related to [TEXT]",
    usage: ["%P%gif [TEXT]"],
    dm: true,
}