const { get } = require("superagent")

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    message.channel.startTyping(true);
    if (!args) {
        message.channel.stopTyping(true);
        client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        client.send.log(message);
    } else {
        let res = await get(`https://some-random-api.ml/chatbot?message=${encodeURIComponent(args.join(" "))}`).catch(() => null);
        if (!res) return message.reply(`Unable to fetch the response`);
        if (!res.body) return message.reply(`Unable to fetch the response..`);
        let output = await res.body.response;
        message.channel.send(output);
        await message.channel.stopTyping(true);
        client.send.log(message);
    }
}

module.exports.code = {
    name: "chat",
    description: "/BOT/ as a chatbot",
    group: "interact",
    usage: ["/PREFIX/chat [TEXT]"],
    accessableby: "Villagers",
    aliases: ["chat", "j"]
}