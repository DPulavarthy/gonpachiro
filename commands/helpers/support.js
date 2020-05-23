module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }
    let field = ``;
    field += `${client.arrow} [Support server](${client.util.link.support})\n`;
    field += `${client.arrow} [Donate](${client.util.link.donate})\n`;
    field += `${client.arrow} [Vote](${client.util.link.vote})\n`;
    field += `${client.arrow} [Website](${client.util.link.website})\n`;
    const embed = client.send.embed()
        .setAuthor(`${client.user.username}'s Support Links`, client.util.link.logo, client.util.link.support)
        .setDescription(field)
    await message.channel.send(embed);
    return client.send.log(message);
}

module.exports.code = {
    name: "support",
    description: "client's support links",
    group: "helpers",
    usage: ["/PREFIX/support"],
    accessableby: "Villagers",
    aliases: ["support"]
}