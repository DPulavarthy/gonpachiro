module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const input = args.join(" ");
    if (!input) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    } else {
        const embed = client.send.embed()
            .setAuthor(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL(), client.util.link.support)
            .setDescription(input)
        await message.channel.send(embed);
        return client.send.log(message);
    }
}

module.exports.code = {
    name: "say",
    description: "Sends [TEXT]",
    group: "interact",
    usage: ["/PREFIX/say [TEXT]"],
    accessableby: "Villagers",
    aliases: ["say"]
}