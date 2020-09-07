module.exports.run = async (client, message, args) => {
    if (!args.join(` `)) { loading.delete(); return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    else { message.channel.send(client.embed().setAuthor(`Requested by: ${message.author.tag}`, message.author.avatarURL({ format: "png", dynamic: true, size: 2048 })).setDescription(Buffer.from(args.join(` `)).toString(`base64`))); return client.log(message); };
}

module.exports.code = {
    title: "base64",
    about: "Encode [TEXT]",
    usage: ["%P%encode64 [TEXT]"],
    alias: ["encode64"],
    dm: true,
}