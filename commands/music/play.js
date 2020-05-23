const { Util } = require("discord.js");
const { play } = require("../../player.js");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");

module.exports.run = async (client, message, args) => {
    const youtube = new YouTubeAPI(client.util.api.google);
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const { channel } = message.member.voice;

    if (!args.length) return message.reply("Usage: /play <YouTube URL | Video Name>").catch(console.error);
    if (!channel) return message.reply("You need to join a voice channel first!").catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
        return message.reply("Cannot connect to voice channel, missing permissions");
    if (!permissions.has("SPEAK"))
        return message.reply("I cannot speak in this voice channel, make sure I have the proper permissions!");

    const search = args.join(" ");
    const url = args[0];
    if ((!url.startsWith(`https://youtu.be/`) && !url.startsWith(`http://www.youtube.com/watch?v=`)) && url.startsWith(`https://www.youtube.com/playlist?list=`)) {
        return message.client.commands.get("playlist").run(client, message, args);
    }


    const serverQueue = message.client.queue.get(message.guild.id);
    const queueConstruct = {
        textChannel: message.channel,
        channel,
        connection: null,
        songs: [],
        loop: false,
        volume: 100,
        playing: true
    };

    let songInfo = null;
    let song = null;

    if (url.startsWith(`https://youtu.be/`) || url.startsWith(`http://www.youtube.com/watch?v=`)) {
        try {
            songInfo = await ytdl.getInfo(url);
            song = {
                title: songInfo.title,
                url: songInfo.video_url,
                duration: songInfo.length_seconds
            };
        } catch (error) {
            if (error.message.includes("copyright")) {
                return message
                    .reply("⛔ The video could not be played due to copyright protection ⛔")
                    .catch(console.error);
            } else {
                console.error(error);
            }
        }
    } else {
        try {
            const results = await youtube.searchVideos(search, 1);
            songInfo = await ytdl.getInfo(results[0].url);
            song = {
                title: songInfo.title,
                url: songInfo.video_url,
                duration: songInfo.length_seconds
            };
        } catch (error) {
            console.error(error);
        }
    }

    if (serverQueue) {
        serverQueue.songs.push(song);
        serverQueue.textChannel
            .send(`✅ **${song.title}** has been added to the queue by ${message.author}`)
            .catch(console.error);
        return;
    } else {
        queueConstruct.songs.push(song);
    }

    if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);

    if (!serverQueue) {
        try {
            queueConstruct.connection = await channel.join();
            play(queueConstruct.songs[0], message);
        } catch (error) {
            console.error(`Could not join voice channel: ${error}`);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return message.channel.send(`Could not join the channel: ${error}`).catch(console.error);
        }
    }
}


module.exports.code = {
    name: "play",
    description: "Plays audio in VC",
    group: "music",
    usage: ["/PREFIX/play [LINK or SEARCH TERM]"],
    accessableby: "Villagers",
    aliases: ["play", "p"]
}