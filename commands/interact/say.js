module.exports.run = async (client, message, args) => {
    if (!args.join(` `)) { return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); };
    message.channel.send(client.embed().setAuthor(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL(), client.util.link.support).setDescription(args.join(` `)));
    return client.log(message);
}

module.exports.code = {
    title: "say",
    about: "Sends [TEXT]",
    usage: ["%P%say [TEXT]"],
    dm: true,
}