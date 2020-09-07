module.exports.run = async (client, message, args) => {
    if (message.channel.type !== `dm`) { message.channel.send(client.src.comment(`Try running this command in DMs`)); return client.log(message); };
    client.database.config.findOne({ case: module.exports.code.title }, async function (error, result) {
        if (error) { client.error(error); };
        if (result.data.length < 1) { message.author.send(client.src.comment(`All the codes are currently claimed.`)); return client.log(message); };
        if (result.used.includes(message.author.id)) { message.author.send(client.src.comment(`You have already claimed 1 code`)); return client.log(message); };
        let code = result.data[0];
        result.data.shift();
        result.used.push(message.author.id);
        let res = { $set: { data: result.data, used: result.used } };
        client.database.config.updateOne({ case: module.exports.code.title }, res, function (error) { if (error) { client.error(error); } });
        let msg = await message.author.send(client.embed().setTitle(`Congratulations`).addField(`You got`, code.title).addField(`Code`, `||**\`${code.secret}\`**||`).setDescription(`React with the "${client.emojis.cache.get(client.emoji.code).toString()}" to get the raw code`));
        await msg.react(client.emojis.cache.get(client.emoji.code));
        const filter = (reaction, user) => [client.emojis.cache.get(client.emoji.code).name].includes(reaction.emoji.name) && (client.user.id !== user.id);
        const collector = msg.createReactionCollector(filter);
        collector.on('collect', async () => {
            collector.stop();
            message.author.send(code.secret);
        });
        setTimeout(async () => { collector.stop(); }, 20 * 1000);
        return client.log(message);
    })
}

module.exports.code = {
    title: "giveaway",
    about: "Claim codes from a giveaway",
    usage: ["%P%claim"],
    alias: ["redeem", "claim"],
    dm: true,
}