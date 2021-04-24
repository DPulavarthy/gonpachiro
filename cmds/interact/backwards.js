module.exports.run = async (client, message, args, guild) => {
    if (!args[0]) return client.src.invalid(message, module.exports.code.title, guild)
    return message.channel.send(client.embed().setAuthor(`Requested by: ${message.author.tag}`, message.author.avatarURL({ format: "png", dynamic: true, size: 2048 })).setDescription(args.join(` `).split(``).reverse().join(``)))
}

module.exports.code = {
    title: "backwards",
    about: "Sends [TEXT] in reverse",
    usage: ["%P%backwards [TEXT]"],
    alias: ["b", "reverse"],
}