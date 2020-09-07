module.exports.run = async (client, message, args) => {
    if (!args.join(` `)) { loading.delete(); return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    else { message.channel.send(client.embed().setAuthor(`Requested by: ${message.author.tag}`, message.author.avatarURL({ format: "png", dynamic: true, size: 2048 })).setDescription(args.join(` `).split(``).reverse().join(``))); return client.log(message); };
}

module.exports.code = {
    title: "backwards",
    about: "Sends [TEXT] in reverse",
    usage: ["%P%backwards [TEXT]"],
    alias: ["b", "reverse"],
    dm: true,
}