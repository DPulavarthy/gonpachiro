module.exports.run = async (client, message, args) => { await message.channel.send(client.src.comment(`The input text has ${args.join(` `).length.toLocaleString()} characters`)); return client.log(message); }

module.exports.code = {
    title: "count",
    about: "Count number of characters in [TEXT]",
    usage: ["%P%count [TEXT]"],
    alias: ["c"],
    dm: true,
}