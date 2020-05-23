const ms = require("ms");

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!client.send.approve(message.author.id, `OWNER`)) {
        client.send.restrict(message, 16);
        return client.send.log(message, `hiro`);
    }
    let duration,
        reason;
    if (args.join(" ")) {
        if (args[0].toLowerCase() === `end` || args[0].toLowerCase() === `e` || args[0].toLowerCase() === `stop`) {
            try {
                if (!client.send.afk(message.author.id)) {
                    await message.react(client.emojis.cache.get(client.util.emoji.cross));
                    await message.channel.send(`You are not AFK, to start your AFK status, type \`${client.config.prefix}afk [TIME] [REASON]\``);
                    return client.send.log(message);
                }
                client.send.endAFK(message.author.id);
                message.react(client.emojis.cache.get(client.util.emoji.check))
                return client.send.log(message, `hiro`)
            } catch (error) {
                message.channel.send(client.emojis.cache.get(client.util.emoji.check).toString() + ` I was unable to remove your AFK status: ${error}`);
                return client.send.log(message, `hiro`);
            }
        }
        if (client.send.afk(message.author.id)) {
            await message.react(client.emojis.cache.get(client.util.emoji.cross));
            await message.channel.send(`You are not AFK, to start your AFK status, type \`${client.config.prefix}afk [TIME] (REASON)\``);
            return client.send.log(message);

        }
        if (args[0]) {
            duration = ms(args[0])
            if (duration) {
                if (duration < 60000) {
                    message.channel.send(`Duration too short, minimum time \`1 minute\`, you provided ${ms(duration, { long: true })}`)
                    return client.send.log(message);
                }
                reason = args.slice(1).join(" ");
                if (!reason) {
                    reason = `No reason provided!`
                }
                if (client.send.afk(message.author.id)) {
                    await message.react(client.emojis.cache.get(client.util.emoji.cross));
                    return client.send.log(message, `hiro`);
                } else {
                    try {
                        client.send.setAFK(message.author.id, reason)
                        message.react(client.emojis.cache.get(client.util.emoji.check))
                        setTimeout(function () {
                            if (client.send.afk(message.author.id)) {
                                client.send.endAFK(message.author.id)
                                message.reply(` I have ended your AFK status after ${ms(duration)}`)
                            }
                        }, duration);
                    } catch (error) {
                        await message.channel.send(client.emojis.cache.get(client.util.emoji.cross).toString() + ` I was unable to add your AFK status: ${error}`);
                        return client.send.log(message, `hiro`);
                    }
                }
            } else {
                await message.channel.send(`Duration not provided`);
                return client.send.log(message, `hiro`);
            }
        } else {
            await message.channel.send(`Duration not provided`);
            return client.send.log(message, `hiro`);
        }
    } else {
        await message.react(client.emojis.cache.get(client.util.emoji.cross))
        return client.send.log(message, `hiro`);
    }
}

module.exports.code = {
    name: "afk",
    description: "Set's an AFK status for message author",
    group: "owner",
    usage: ["/PREFIX/afk [TIME] (REASON)"],
    accessableby: "Owner",
    aliases: ["afk"]
}