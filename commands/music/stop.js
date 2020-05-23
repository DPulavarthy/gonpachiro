module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
        return message.reply("You need to join a voice channel first!").catch(console.error);
    if (!serverQueue) return message.reply("There is nothing playing.").catch(console.error);

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    serverQueue.textChannel.send(`${message.author} ⏹ stopped the music!`).catch(console.error);
}

module.exports.code = {
    name: "stop",
    description: "Ends queue",
    group: "music",
    usage: ["/PREFIX/stop"],
    accessableby: "Villagers",
    aliases: ["stop"]
}