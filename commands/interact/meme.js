module.exports.run = async (client, message, args) => {
    let res = await require(`superagent`).get(`https://meme-api.herokuapp.com/gimme`).catch(() => null);
    if (!res) return message.reply(`Unable to fetch the response`);
    if (!res.body) return message.reply(`Unable to fetch the response..`);
    message.channel.send(client.embed().setAuthor(`Requested by: ${message.author.tag}`, message.author.avatarURL({ format: "png", dynamic: true, size: 2048 })).setDescription(`[${res.body.title}, Subreddit: ${res.body.subreddit}](${res.body.postLink})`).setImage(res.body.url));
    return client.log(message);
}

module.exports.code = {
    title: "meme",
    about: "Returns random meme",
    usage: ["%P%meme"],
    nsfw: true,
}