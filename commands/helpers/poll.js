module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!args.join(" ") || (args[0].toUpperCase() != `UD` && args[0].toUpperCase() != `YN` && args[0].toUpperCase() != `TF`) || !args.slice(1).join(" ")) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    }
    const embed = client.send.embed();
    const question = args.slice(1).join(" ");
    await message.delete();
    if (args[0].toUpperCase() === `UD`) {
        embed
            .setAuthor(`New poll by: ${message.author.tag}`, message.author.displayAvatarURL(), client.util.link.support)
            .setDescription(`QUESTION: ${question}`)
        message.channel.send(embed).then(function (message) {
            message.react(client.emojis.cache.get(client.util.emoji.up))
                .then(() => message.react(client.emojis.cache.get(client.util.emoji.down)))
        });
    }
    if (args[0].toUpperCase() === `YN`) {
        embed
            .setAuthor(`New poll by: ${message.author.tag}`, message.author.displayAvatarURL(), client.util.link.support)
            .setDescription(`QUESTION: ${question}`);
        message.channel.send(embed).then(function (message) {
            message.react(client.emojis.cache.get(client.util.emoji.check))
                .then(() => message.react(client.emojis.cache.get(client.util.emoji.cross)))
        });
    }
    if (args[0].toUpperCase() === `TF`) {
        embed
            .setAuthor(`New poll by: ${message.author.tag}`, message.author.displayAvatarURL(), client.util.link.support)
            .setDescription(`QUESTION: ${question}`);
        message.channel.send(embed).then(function (message) {
            message.react(client.emojis.cache.get(client.util.emoji.true))
                .then(() => message.react(client.emojis.cache.get(client.util.emoji.false)))
        });
    }
}

module.exports.code = {
    name: "poll",
    description: "A poll for [QUESTION], ud = up/down, tf = true/false, yn = yes/no",
    group: "helpers",
    usage: ["/PREFIX/poll [ud or tf or yn] [QUESTION]"],
    accessableby: "Villagers",
    aliases: ["poll"]
}