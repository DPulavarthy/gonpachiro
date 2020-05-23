module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.reply("There is nothing playing.").catch(console.error);
    return message
        .reply(
            `📃 **Song queue**
  ${serverQueue.songs.map((song, index) => index + 1 + ". " + song.title).join("\n")}
  Now playing: **${serverQueue.songs[0].title}**
          `,
            { split: true }
        )
        .catch(console.error);
}

module.exports.code = {
    name: "queue",
    description: "Now playing",
    group: "music",
    usage: ["/PREFIX/queue"],
    accessableby: "Villagers",
    aliases: ["queue", "nowplaying", "q", "np"]
}