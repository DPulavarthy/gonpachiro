module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }
    client.send.nsfw(message, `This is not a command with any NSFW content, it is merely to check which channels of a server have NSFW enabled`);
    return client.send.log(message);
}

module.exports.code = {
    name: "nsfwcheck",
    description: "Get the list of NSFW channels in a server",
    group: "information",
    usage: ["/PREFIX/nsfwcheck"],
    accessableby: "Villagers",
    aliases: ["nsfwcheck"]
}