module.exports.run = async (client, message, args) => {
    if (!args.join(` `)) { loading.delete(); return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    else { message.channel.send(client.embed().setAuthor(`Requested by: ${message.author.tag}`, message.author.avatarURL({ format: "png", dynamic: true, size: 2048 })).setDescription(require(`decode-encode-binary`).auto(args.join(` `), true))); return client.log(message); };
}

module.exports.code = {
    title: "binary",
    about: "Convers [TEXT] to binary or [BINARY] to text",
    usage: ["%P%binary [TEXT || BINARY]"],
    dm: true,
}