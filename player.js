const ytdlDiscord = require("ytdl-core-discord");
const send = require(`./send.js`);
const util = require(`./util.js`);

module.exports = {
  async play(song, message) {
    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
      return queue.textChannel.send(send.embed().setTitle(`🚫 Music queue ended.`).setDescription(`Consider [donating](${util.link.donate}) or [inviting](${util.link.invite}) ${send.clean(`/BOT/`)}`)).catch(console.error);
    }

    try {
      var stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      if (error.message.includes("copyright")) {
        return message.channel
          .send("⛔ A video could not be played due to copyright protection ⛔")
          .catch(console.error);
      } else {
        console.error(error);
      }
    }

    const dispatcher = queue.connection
      .play(stream, { type: "opus" })
      .on("finish", () => {
        if (queue.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          // Recursively play the next song
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", err => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    try {
      var playingMessage = await queue.textChannel.send(`🎶 Started playing: **${song.title}** ${song.url}`);
      await playingMessage.react("⏭");
      await playingMessage.react("⏸");
      await playingMessage.react("▶");
      await playingMessage.react("🔁");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    const collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      // Stop if there is no queue on the server
      if (!queue) return;

      switch (reaction.emoji.name) {
        case "⏭":
          queue.connection.dispatcher.end();
          queue.textChannel.send(`${user} ⏩ skipped the song`).catch(console.error);
          collector.stop();
          break;

        case "⏸":
          if (!queue.playing) break;
          queue.playing = false;
          queue.connection.dispatcher.pause();
          queue.textChannel.send(`${user} ⏸ paused the music.`).catch(console.error);
          reaction.users.remove(user);
          break;

        case "▶":
          if (queue.playing) break;
          queue.playing = true;
          queue.connection.dispatcher.resume();
          queue.textChannel.send(`${user} ▶ resumed the music!`).catch(console.error);
          reaction.users.remove(user);
          break;

        case "🔁":
          queue.loop = !queue.loop;
          queue.textChannel
            .send(`Loop is now ${queue.loop ? "**on**" : "**off**"}`)
            .catch(console.error);
          reaction.users.remove(user);
          break;

        case "⏹":
          queue.songs = [];
          queue.textChannel.send(`${user} ⏹ stopped the music!`).catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll();
    });
  }
};  