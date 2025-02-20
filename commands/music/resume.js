module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
        return message.reply("You need to join a voice channel first!").catch(console.error);

    if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return serverQueue.textChannel.send(`${message.author} ▶ resumed the music!`).catch(console.error);
    }
    return message.reply("There is nothing playing.").catch(console.error);
}

module.exports.code = {
    name: "resume",
    description: "Resumes VC audio",
    group: "music",
    usage: ["/PREFIX/resume"],
    accessableby: "Villagers",
    aliases: ["resume", "res"]
}