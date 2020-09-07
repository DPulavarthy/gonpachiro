module.exports.run = async (client, message, args) => {
    await message.channel.createInvite({ maxAge: 0, maxUses: 1 }).then(invite => { return channel(invite); }).catch(() => { return channel(); });

    function channel(invite) {
        let field = [];
        field.push(`${client.arrow} Channel name: ${message.channel.name}`);
        field.push(`${client.arrow} Channel type: ${message.channel.type}`);
        field.push(`${client.arrow} Channel ID: ${message.channel.id}`);
        field.push(`${client.arrow} NSFW channel: ${message.channel.nsfw ? `Yes` : `No`}`);
        field.push(`${client.arrow} Category name: ${message.channel.parent ? message.channel.parent.name : `N/A`}`);
        field.push(`${client.arrow} Category ID: ${message.channel.parent ? message.channel.parent.id : `N/A`}`);
        field.push(`${client.arrow} Channel mention: ${message.channel.type === `text` ? message.channel.toString() : `N/A`}`);
        field.push(`${client.arrow} Temp invite link: ${invite ? `[Allows 1 user to join](${invite})` : `N/A`}`);
        field.push(`${client.arrow} Channel topic: ${message.channel.topic || `N/A`}`);
        message.channel.send(client.embed().setAuthor(`Information for ${message.channel.name}`).setDescription(field.join(`\n`)));
        return client.log(message);
    }
}

module.exports.code = {
    title: "channel",
    about: "Get info about the current channel",
    usage: ["%P%channel"],
}