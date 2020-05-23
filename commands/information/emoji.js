module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let field = ``,
        emoji;
    if (!args.join(" ")) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    } else {
        let loc = args.join(" ").lastIndexOf(`:`);
        if (loc) {
            emoji = client.emojis.cache.get(args.join(" ").substring(loc + 1, args.join("").length - 1))
        } else {
            emoji = client.emojis.cache.get(args.join(" "));
        }
    }
    try {
        field += `${client.arrow} Name: ${emoji.name}\n`;
        field += `${client.arrow} ID: ${emoji.id}\n`;
        field += `${client.arrow} Full ID: \`${emoji.toString() || `N/A`}\`\n`;
        field += `${client.arrow} Emoji: ${emoji.toString()}\n`;
        field += `${client.arrow} Animated: ${emoji.animated ? `Yes` : `No` || `N/A`}\n`;
        const embed = client.send.embed()
            .setTitle(`Information for emoji: ${emoji.name}`)
            .setDescription(field)
            .setImage(emoji.url)
        await message.channel.send(embed);
        return client.send.log(message);
    } catch (error) {
        await client.send.report(message, error);
        return client.send.log(message);
    }
}

module.exports.code = {
    name: "emoji",
    description: "Get the information for [EMOJI_ID]",
    group: "information",
    usage: ["/PREFIX/emoji [EMOJI_ID]"],
    accessableby: "Villagers",
    aliases: ["emoji"]
}