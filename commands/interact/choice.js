module.exports.run = async (client, message, args, prefix) => {
    let word = message.content.substring(prefix.length, prefix.length + 2).toLowerCase(), data = Math.floor(Math.random() * (2)) === 1 ? true : false;
    if (word.includes(`yn`)) { const embed = client.embed().setAuthor(`Requested by: ${message.author.tag}`, message.author.avatarURL({ format: "png", dynamic: true, size: 2048 })).setDescription(data ? `Yes` : `No`); message.channel.send(embed); return client.log(message); }
    else if (word.includes(`tf`)) { message.channel.send(client.embed().setAuthor(`Requested by: ${message.author.tag}`, message.author.avatarURL({ format: "png", dynamic: true, size: 2048 })).setDescription(data ? `True` : `False`)); return client.log(message); }
    else { message.channel.send(`¯\\_(ツ)_/¯`); };
}

module.exports.code = {
    title: "choice",
    about: "Yes/No or True/False decision",
    usage: ["%P%yn (TEXT)", "%P%tf (TEXT)"],
    alias: ["yn", "tf"],
    dm: true,
}