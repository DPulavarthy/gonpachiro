module.exports.run = async (client, message, args, prefix) => {
    client.database.config.findOne({ case: `data` }, async function (error, result) {
        if (error) { client.error(error); };
        let developer = result.data.find(group => group.rank === 7);
        if (!message.guild.members.cache.get(message.author.id).hasPermission(`ADMINISTRATOR`) && !developer.data.includes(message.author.id)) { message.channel.send(client.src.comment(`You do not have the following permission: ADMINISTRATOR`)); return client.log(message); };
        if (!args.join(` `)) {
            client.database.guilds.findOne({ id: message.guild.id }, async function (error, result) {
                if (error) { client.error(error); };
                if (!result) { message.channel.send(client.src.comment(`${message.guild.name} has no data to delete, \'${prefix}setup help\' for more information.`)); return client.log(message); };
                let check = client.emojis.cache.get(client.emoji.check), cross = client.emojis.cache.get(client.emoji.cross);
                try {
                    let msg = await message.author.send(client.embed().setTitle(`${client.emojis.cache.get(client.emoji.warning).toString()} React with the "${check.toString()}" below to delete the data for ${message.guild.name}, or react with "${cross.toString()}" to cancel. ${client.emojis.cache.get(client.emoji.warning).toString()}`).setDescription(`${client.emojis.cache.get(client.emoji.warning).toString()} **By agreeing to this message means you will loose all gacha data, nitro mockup, logging channel, and custom prefixes. ${client.user.username} will still function in your server without these features.** ${client.emojis.cache.get(client.emoji.warning).toString()}`));
                    message.channel.send(client.src.comment(`Check your DMs`));
                    await msg.react(check);
                    await msg.react(cross);
                    const filter = (reaction, user) => [check.name, cross.name].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
                    const collector = msg.createReactionCollector(filter);
                    collector.on('collect', async (reaction) => {
                        if (reaction.emoji.name === check.name) { collector.stop(); client.database.guilds.deleteOne({ id: message.guild.id }, function (error) { if (error) { client.error(error); }; }); msg.edit(client.src.comment(`Data deletion successful!`)); return client.log(message); };
                        if (reaction.emoji.name === cross.name) { collector.stop(); msg.edit(client.src.comment(`Data deletion cancelled!`)); return client.log(message); };
                    });
                    setTimeout(async () => { collector.stop(); }, 20 * 1000);
                } catch (error) { message.channel.send(client.src.comment(`DM message failed, ERROR: ${error}`)); return client.log(message); };
            })
        }
    })
}

module.exports.code = {
    title: "delete",
    about: "Delete server data from %B%",
    group: "special",
    usage: ["%P%delete"],
}