const ms = require('ms');

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let duration = ms(args[0])
    if (!args[0]) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    }
    if (duration) {
        if (duration < 60000) {
            message.channel.send(`Duration too short, minimum time \`1 minute\`, you provided ${ms(duration, { long: true })}`)
            return client.send.log(message);
        }
        reason = args.slice(1).join(" ");
        if (!reason) { reason = `No reason provided!` }
    }
    message.channel.send(`${client.emojis.cache.get(client.util.emoji.check).toString()} Timer started for ${ms(duration, { long: true })}`);

    setTimeout(function () {
        message.channel.send(message.author.toString() + `, The Timer Has ended!, it lasted: ${ms(duration, { long: true })}, with the reason: ${reason}`);
    }, duration);
    client.send.log(message);
}

module.exports.code = {
    name: "timer",
    description: "A simple timer for users",
    group: "helpers",
    usage: ["/PREFIX/timer [TIME] (REASON)"],
    accessableby: "Villagers",
    aliases: ["timer"]
}