module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (args.join(" ")) {
        if (!client.send.approve(message.author.id, `APPROVED`)) {
            client.send.restrict(message, 14);
            await message.channel.send(embed);
            return client.send.log(message, `hiro`);
        } else {
            if (args[0].toLowerCase() === `toggle`) {
                if (args[1].toLowerCase() === `off` || args[1].toLowerCase() === `down`) {
                    if (client.send.status(args[2])) {
                        await message.react(client.emojis.cache.get(client.util.emoji.cross));
                        await message.channel.send(`${args[2]} is already on the disabled list`);
                    } else {
                        let result = client.send.globalOFF(args[2]);
                        if (result === `success`) {
                            await message.react(client.emojis.cache.get(client.util.emoji.check));
                        } else {
                            await message.react(client.emojis.cache.get(client.util.emoji.cross));
                            await message.channel.send(result);
                        }
                    }
                    return client.send.log(message, `hiro`);
                } else if (args[1].toLowerCase() === `on` || args[1].toLowerCase() === `up`) {
                    if (client.send.status(args[2])) {
                        client.send.globalON(args[2]);
                        await message.react(client.emojis.cache.get(client.util.emoji.check));
                        return client.send.log(message, `hiro`);
                    } else {
                        await message.react(client.emojis.cache.get(client.util.emoji.cross));
                        await message.channel.send(`${args[2]} is not in the disabled list`);
                        return client.send.log(message, `hiro`);
                    }
                } else {
                    await message.react(client.emojis.cache.get(client.util.emoji.cross))
                    return client.send.log(message, `hiro`);
                }
            } else {
                await message.react(client.emojis.cache.get(client.util.emoji.cross))
                return client.send.log(message, `hiro`);
            }
        }
    }
}

module.exports.code = {
    name: "global",
    description: "Globally enable or disable commands",
    group: "devs",
    usage: ["/PREFIX/global toggle [UP OR DOWN] [COMMAND]"],
    accessableby: "Gonpachiro",
    aliases: ["global"]
}
