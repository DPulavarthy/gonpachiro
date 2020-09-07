module.exports.run = async (client, message, args) => {
    if (!args.join(` `)) { return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); };
    message.channel.send(client.embed().setAuthor(`Requested by: ${message.author.tag}`, message.author.avatarURL({ format: "png", dynamic: true, size: 2048 })).setDescription(require(`owoify-js`).default(args.join(` `))));
    return client.log(message);
}

module.exports.code = {
    title: "owo",
    about: "owoifies text",
    usage: ["%P%owo [TEXT]"],
    alias: ["uwu"],
    dm: true,
}