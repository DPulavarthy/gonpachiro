module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.reply("There is nothing playing.").catch(console.error);

    // toggle from false to true and reverse
    serverQueue.loop = !serverQueue.loop;
    return serverQueue.textChannel
        .send(`Loop is now ${serverQueue.loop ? "**on**" : "**off**"}`)
        .catch(console.error);
}

module.exports.code = {
    name: "loop",
    description: "Set's music loop on/off",
    group: "music",
    usage: ["/PREFIX/loop"],
    accessableby: "Villagers",
    aliases: ["loop"]
}