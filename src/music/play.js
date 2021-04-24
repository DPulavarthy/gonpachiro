let [ytpl] = [require(`ytpl`)]

module.exports.run = async (client, message, args) => {
    // Member in voice channel check
    if (!message.member.voice.channel) return message.channel.send(client.comment(`Please join a voice channel before running this command!`))
    // Bot and member in the samce channel check
    if (message.guild.me.voice.channel) { if (message.member.voice.channel != message.guild.me.voice.channel) return message.channel.send(client.comment(`Please be in the same voice channel as the bot before using the command!`)); }
    // Check if args are empty
    if (!args[0]) return message.channel.send(client.comment(`Please provide a song name or URL!`))
    // Bot is already playing
    if (client.music.isPlaying(message.guild.id)) {
        // Check if link is args is a playlist link
        if (ytpl.validateID(args[0])) {
            // Add playlist to already existing queue
            let playlist = await client.music.playlist(message.guild.id, args[0], message.member.voice.channel, Infinity);
            let embed = client.embed()
                .setAuthor(`Playlist added to queue`)
                .setTitle(playlist.song.name)
                .setURL(playlist.playlist.link)
                .setImage(playlist.song.thumbnail)
                .addField(`Video Count`, playlist.playlist.videoCount, true)
                .addField(`Volume`, playlist.song.queue.volume, true)
                .addField(`Channel`, playlist.playlist.channel, false)
                .addField(`Requested By`, playlist.song.requestedBy, true)

            message.channel.send(embed);
        } 
        // Args was not a playlist link
        else { 
            // Add song to already existing queue
            await client.music.addToQueue(message.guild.id, args.join(' '), {}, message.author.tag).then( async result => {
                if(result.error) return message.channel.send('No Song Found');
                let embed = client.embed()
                    .setAuthor(`Song added to queue`)
                    .setTitle(result.song.name)
                    .setURL(result.song.url)
                    .setImage(result.song.thumbnail)
                    .addField(`Duration`, result.song.duration, true)
                    .addField(`Volume`, result.song.queue.volume, true)
                    .addField(`Repeat`, result.song.queue.repeatMode ? `Yes`: `No`, false)
                    .addField(`Requested By`, result.song.requestedBy, true)

                message.channel.send(embed);
            });
        }
    } 
    // Bot is not already playing
    else {
        // Check if link is args is a playlist link
        if (ytpl.validateID(args[0])) {
            // Add playlist to new queue
            let playlist = await client.music.playlist(message.guild.id, args[0], message.member.voice.channel, Infinity);
            console.log(playlist) 
            let embed = client.embed()
                .setAuthor(`Playlist added to queue`)
                .setTitle(playlist.song.name)
                .setURL(playlist.playlist.link)
                .setImage(playlist.song.thumbnail)
                .addField(`Video Count`, playlist.playlist.videoCount, true)
                .addField(`Channel`, playlist.playlist.channel, true)
                .addField(`Volume`, playlist.song.queue.volume, true)
                .addField(`Requested By`, playlist.song.requestedBy, true)

            message.channel.send(embed);
        } 
        // Args was not a playlist link 
        else {
            // Add song to new queue 
            await client.music.play(message.member.voice.channel, args.join(' '), {}, message.author.tag).then(result => {
                if(result.error) return message.channel.send('No Song Found');
                let embed = client.embed()
                    .setAuthor(`Song added to queue`)
                    .setTitle(result.song.name)
                    .setURL(result.song.url)
                    .setImage(result.song.thumbnail)
                    .addField(`Author`, result.song.author, true)
                    .addField(`Duration`, result.song.duration, true)
                    .addField(`Volume`, result.song.queue.volume, true)
                    .addField(`Repeat`, result.song.queue.repeatMode ? `Yes`: `No`, true)
                    .addField(`Requested By`, result.song.requestedBy, true)

                message.channel.send(embed);
            });
        }
    }

    client.music.getQueue(message.guild.id)
    .on('end', () => {
      message.channel.send(client.comment(`Playlist is empty, leaving voice channel!`));
    })
    .on('songChanged', (oldSong, newSong) => {
        message.channel.send(`Ended playing ${oldSong.name}! Now playing ${newSong.name}!`);
    })
    .on('channelEmpty', () => {
        message.channel.send(client.comment(`Everyone left the voice channel, leaving voice channel!`));
    });
}

module.exports.data = {
    title: `play`,
    about: `Plays a song `,
    alias: [`p`, `pplay`]
}


/* For embed info (song)
{
  error: null,
  song: Song {
    name: '6IX9INE- GOOBA (Official Music Video)',
    duration: '2:29',
    author: 'Tekashi 6ix9ine',
    url: 'https://youtu.be/pPw_izFr5PA',
    thumbnail: 'https://yt3.ggpht.com/ytc/AAUvwnhrP3wv1CE2kO1ncSfgunPoZ0qXNT0RiKxJo1jlJA=s176-c-k-c0xffffffff-no-nd-rj-mo',
    queue: Queue {
      _events: [Object: null prototype] {},
      _eventsCount: 0,
      _maxListeners: undefined,
      guildID: '790737746394218526',
      dispatcher: [StreamDispatcher],
      connection: [VoiceConnection],
      songs: [Array],
      stopped: false,
      skipped: false,
      volume: 100,
      playing: true,
      repeatMode: false,
      [Symbol(kCapture)]: false
    },
    requestedBy: 'Nina#3643'
  }
}
*/


/* For embed info (playlist)
{
  error: null,
  song: Song {
    name: 'Future - Life Is Good (Official Music Video) ft. Drake',
    duration: '5:36',
    author: 'Future',
    url: 'https://www.youtube.com/watch?v=l0U7SxXHkPY',
    thumbnail: 'https://i.ytimg.com/vi/l0U7SxXHkPY/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDIw9ZMenLGKD_UsDSU-EMpKT9WUg',
    queue: Queue {
      _events: [Object: null prototype] {},
      _eventsCount: 0,
      _maxListeners: undefined,
      guildID: '790737746394218526',
      dispatcher: [StreamDispatcher],
      connection: [VoiceConnection],
      songs: [Array],
      stopped: false,
      skipped: false,
      volume: 100,
      playing: true,
      repeatMode: false,
      [Symbol(kCapture)]: false
    },
    requestedBy: undefined
  },
  playlist: {
    link: 'https://youtube.com/playlist?list=PLbpi6ZahtOH7eFIp5Cc15AnhiIdkjgmdC',
    playlistSongs: [
      [Song], [Song],
      [Song], [Song],
      [Song], [Song],
      [Song], [Song],
      [Song], [Song]
    ],
    videoCount: 10,
    channel: 'YouTube'
  }
}
*/