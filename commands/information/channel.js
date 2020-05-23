module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const channel = message.channel;
    let field = ``,
        invite = await message.channel.createInvite(
            {
                maxAge: 0, // maximum time for the invite, in milliseconds
                maxUses: 1 // maximum times it can be used
            },
            `Requested with command by ${message.author.tag}`
        ).catch(console.log);

    field += `${client.arrow} Channel name: ${channel.name}\n`;
    field += `${client.arrow} Channel type: ${channel.type}\n`;
    field += `${client.arrow} Channel ID: ${channel.id}\n`;
    field += `${client.arrow} NSFW channel: ${channel.nsfw ? `Yes` : `No`}\n`;
    field += `${client.arrow} Category name: ${channel.parent.name || `N/A`}\n`;
    field += `${client.arrow} Category ID: ${channel.parent.id || `N/A`}\n`;
    field += `${client.arrow} Channel mention: ${channel.type === `text` ? channel.toString() : `N/A`}\n`;
    field += `${client.arrow} Temp invite link: ${invite ? `[Allows 1 user to join](${invite})` : `N/A`}\n`;
    field += `${client.arrow} Channel topic: ${channel.topic || `N/A`}\n`;
    const embed = client.send.embed()
    .setAuthor(`Information for ${channel.name}`, client.util.link.logo, client.util.link.support)
        .setDescription(field)
    message.channel.send(embed);
}

module.exports.code = {
    name: "channel",
    description: "Get the info for [CHANNEL]",
    group: "information",
    usage: ["/PREFIX/channel [CHANNEL]"],
    accessableby: "Villagers",
    aliases: ["channel", "channelinfo", "cinfo", "ci"]
}