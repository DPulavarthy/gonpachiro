module.exports.run = async (client, message, args) => {
    if (!args.join(` `)) { loading.delete(); return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    else { message.channel.send(client.embed().setAuthor(`Requested by: ${message.author.tag}`, message.author.avatarURL({ format: "png", dynamic: true, size: 2048 })).setDescription(Buffer.from(args.join(` `), `base64`).toString(`ascii`))); return client.log(message); };
}

module.exports.code = {
    title: "decode64",
    about: "Decodes [TEXT]",
    usage: ["/PREFIX/decoder64 [TEXT]"],
    dm: true,
}