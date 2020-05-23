const { get } = require("superagent")

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let input = args.join(" ");
    if (!input) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    } else {
        let res = await get(`https://some-random-api.ml/binary?decode=${encodeURIComponent(args.join(" "))}`).catch(() => null);
        if (!res) return message.reply(`Unable to fetch the response`);
        if (!res.body) return message.reply(`Unable to fetch the response..`);
        try {
            const embed = client.send.embed()
                .setAuthor(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL(), client.util.link.support)
                .setDescription(res.body.text)
            await message.channel.send(embed);
            return client.send.log(message);
        } catch (error) {
            client.send.report(message, error);
            return client.send.log(message);
        }
    }
}

module.exports.code = {
    name: "removebinary",
    description: "Translates [BINARY TEXT] to text",
    group: "interact",
    usage: ["/PREFIX/removebinary [BINARY TEXT]"],
    accessableby: "Villagers",
    aliases: ["rembi", "removebi", "rembinary", "removebinary"]
}