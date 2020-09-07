module.exports.run = async (client, message, args) => {
    client.database.config.findOne({ case: `giveaway` }, async function (error, result) {
        if (error) { client.error(error); };
        let res = { $set: { used: [] } };
        client.database.config.updateOne({ case: `giveaway` }, res, function (error) { if (error) { client.error(error); } });
        message.react(client.emojis.cache.get(client.emoji.check));
        return client.log(message);
    })
}

module.exports.code = {
    title: "clear",
    about: "Clears the claimed list for the giveaway command",
    usage: ["%P%clear"],
    ranks: 8,
    dm: true,
}