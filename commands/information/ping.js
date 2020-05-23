module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let word = message.content.substring(2, 6).toLowerCase();
    if (word === `ping`) {
        word = client.emojis.cache.get(client.util.emoji.ping).toString() + ` Pong!`;
    } else if (word === `beep`) {
        word = client.emojis.cache.get(client.util.emoji.beep).toString() + ` Boop!`;
    } else if (word === `ding`) {
        word = client.emojis.cache.get(client.util.emoji.ding).toString() + ` Dong!`;
    }

    const msg = await message.channel.send(`Testing...`);
    await msg.edit(`${word}\nLatency is ${msg.createdTimestamp - message.createdTimestamp}ms\nAPI Latency is ${Math.round(client.ws.ping)}ms`);
    return client.send.log(message);
}

module.exports.code = {
    name: "ping",
    description: " Latency + API Latency",
    group: "information",
    usage: ["/PREFIX/ping", "/PREFIX/beep", "/PREFIX/ding"],
    accessableby: "Villagers",
    aliases: ["ping", "beep", "ding"]
}