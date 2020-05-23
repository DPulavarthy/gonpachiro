module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!args || args.length < 2) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    } else {
        let rand = Math.floor(Math.random() * args.length);
        message.channel.send(args[rand]);
        return client.send.log(message);
    }
}

module.exports.code = {
    name: "map",
    description: "Returns 1 arg from [INPUT]",
    group: "requests",
    usage: ["/PREFIX/map [INPUT]"],
    accessableby: "Villagers",
    aliases: ["map"]
}