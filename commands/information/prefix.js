module.exports.run = async (client, message, args, prefix) => {
    message.channel.send(client.embed().setTitle(`${client.user.tag}'s Prefixes for ${message.guild.name}`).setDescription(client.src.code(`${client.prefix}\n${prefix !== client.prefix ? prefix : ``}`)));
    return client.log(message);
}

module.exports.code = {
    title: "prefix",
    about: "List of server prefixes",
    usage: ["%P%prefix"],
}