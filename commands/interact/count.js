module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let input = args.join(" ");
    await message.channel.send(`The text \`${input}\` has ${input.length} characters`);
    return client.send.log(message);
}

module.exports.code = {
    name: "count",
    description: "Count number of characters in [TEXT]",
    group: "interact",
    usage: ["/PREFIX/count [TEXT]"],
    accessableby: "Villagers",
    aliases: ["count", "c"]
}