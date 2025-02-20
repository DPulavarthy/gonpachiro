module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!message.member.voice.channel)
        return message.reply("You need to join a voice channel first!").catch(console.error);

    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause(true);
        return serverQueue.textChannel.send(`${message.author} ⏸ paused the music.`).catch(console.error);
    }
    return message.reply("There is nothing playing.").catch(console.error);
}

module.exports.code = {
    name: "pause",
    description: "Pauses currently playing music",
    group: "music",
    usage: ["/PREFIX/pause"],
    accessableby: "Villagers",
    aliases: ["pause"]
}