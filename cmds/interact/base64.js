module.exports.run = async (client, message, args, guild) => {
    if (!args[0]) return client.src.invalid(message, module.exports.code.title, guild)
    return message.channel.send(client.embed().setAuthor(`Requested by: ${message.author.tag}`, message.author.avatarURL({ format: "png", dynamic: true, size: 2048 })).setDescription(Buffer.from(args.join(` `)).toString(`base64`)))
}

module.exports.code = {
    title: "base64",
    about: "Encode [TEXT]",
    usage: ["%P%encode64 [TEXT]"],
    alias: ["encode"],
}