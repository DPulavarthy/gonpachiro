module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
        return message.reply("You need to join a voice channel first!").catch(console.error);
    if (!serverQueue)
        return message.channel.send("There is nothing playing that I could skip for you.").catch(console.error);

    serverQueue.connection.dispatcher.end();
    serverQueue.textChannel.send(`${message.author} ⏭ skipped the song`).catch(console.error);
}

module.exports.code = {
    name: "skip",
    description: "Skips currently playing",
    group: "music",
    usage: ["/PREFIX/skip"],
    accessableby: "Villagers",
    aliases: ["skip"]
}