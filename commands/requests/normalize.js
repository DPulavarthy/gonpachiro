module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let normalize = Math.round((parseInt(args.join(" ")) / 1.2));
    if (!normalize || normalize === `NaN`) {
        message.channel.send(`Input cannot be modified, make sure it is a number, output: ${normalize}`);
    } else {
        message.channel.send(normalize);
    }
    return client.send.log(message, normalize);
}

module.exports.code = {
    name: "normalize",
    description: "Normalizes number for MA, made for server Heaven's Void (https://discord.gg/bVBRkF4)",
    group: "requests",
    usage: ["/PREFIX/normalize"],
    accessableby: "Villagers",
    aliases: ["normalize", "normal", "n"]
}