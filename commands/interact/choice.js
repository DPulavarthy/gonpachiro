module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const randNum = Math.floor(Math.random() * (2));
    let word = message.content.substring(2, 6).toLowerCase(),
        yn = [`Yes`, `No`],
        tf = [`True`, `False`],
        data = [yn, tf];

    if (word.includes(`yn`)) {
        const embed = client.send.embed()
            .setAuthor(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL(), client.util.link.support)
            .setDescription(data[0][randNum])
        await message.channel.send(embed);
        return client.send.log(message);
    } else {
        const embed = client.send.embed()
            .setAuthor(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL(), client.util.link.support)
            .setDescription(data[1][randNum])
        await message.channel.send(embed);
        return client.send.log(message);
    }
}

module.exports.code = {
    name: "choice",
    description: "Yes/No or True/False decision",
    group: "interact",
    usage: ["/PREFIX/yn (TEXT)", "/PREFIX/tf (TEXT)"],
    accessableby: "Villagers",
    aliases: ["yn", "tf"]
}