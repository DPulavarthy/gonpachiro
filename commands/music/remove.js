module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!args.length) return message.reply("Usage: /remove <Queue Number>");
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("There is no queue.").catch(console.error);

    const song = serverQueue.songs.splice(args[0] - 1, 1);
    serverQueue.textChannel.send(`${message.author} ❌ removed **${song[0].title}** from the queue.`);
}

module.exports.code = {
    name: "remove",
    description: "Removes [NUM] from queue",
    group: "music",
    usage: ["/PREFIX/remove [NUM IN QUEUE]"],
    accessableby: "Villagers",
    aliases: ["remove", "rem"]
}