module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
        return message.reply("You need to join a voice channel first!").catch(console.error);
    if (!serverQueue) return message.reply("There is nothing playing.").catch(console.error);

    if (!args[0])
        return message.reply(`🔊 The current volume is: **${serverQueue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("Please use a number to set volume.").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
        return message.reply("Please use a number between 0 - 100.").catch(console.error);

    serverQueue.volume = args[0];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return serverQueue.textChannel.send(`Volume set to: **${args[0]}%**`).catch(console.error);
}

module.exports.code = {
    name: "volume",
    description: "Set's volume of /BOT/ in VC",
    group: "music",
    usage: ["/PREFIX/volume [1 to 100]"],
    accessableby: "Villagers",
    aliases: ["volume", "vol", "v"]
}