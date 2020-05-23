module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let disabled = `The following commands have been disabled or they are getting fixed. The disabled command(s) might still be active but, they are currently being updated`;
    const embed = client.send.embed()
        .setTitle(`Disabled Commands`)
        .setThumbnail(`https://i.imgur.com/oqhqt65.jpg`)
    if (client.send.status(`list`).length !== 0) {
        embed.addField(disabled,
            `Currently disabled or updating commands\n${client.config.prefix}${client.send.status(`list`).join(`\n${client.config.prefix}`)}`, false)
    } else {
        embed.addField(disabled,
            `No commands are currently disabled`, false)
    }
    await message.channel.send(embed);
    return client.send.log(message);
}

module.exports.code = {
    name: "disabled",
    description: "Currently disabled/updating commands",
    group: "information",
    usage: ["/PREFIX/disabled"],
    accessableby: "Villagers",
    aliases: ["disabled"]
}