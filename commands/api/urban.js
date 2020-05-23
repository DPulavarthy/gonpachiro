const urban = require('urban');

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let input = args.join(" "),
        create = `https://www.urbandictionary.com/add.php`,
        hiro = client.send.hiro(message, args);
    if (!input) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    }
    if (!message.channel.nsfw && !hiro) return client.send.nsfw(message)
    if (hiro) {
        input = args.splice(1).join(" ");
    }
    urban(input).first(async json => {
        if (!json) {
            const embed = client.send.embed()
                .setTitle(`No such word exists on the Urban Dictionary!`)
                .addField(`Define the word for others to know`, `[Make a new word](` + create + `)`, false);
            await message.channel.send(embed);
            return client.send.log(message);
        }
        let def = json.definition;
        if (def.length > 2000) {
            def = def.substring(0, 1997) + `...`
        }
        const embed = client.send.embed()
            .setTitle(`Definition of: ` + json.word)
            .setURL(json.permalink)
            .setDescription(def)
            .addField('Upvotes', json.thumbs_up, true)
            .addField('Downvotes', json.thumbs_down, true)
        await message.channel.send(embed);
        return client.send.log(message);
    });

}

module.exports.code = {
    name: "urban",
    description: "Definiton of [TEXT]",
    group: "api",
    usage: ["/PREFIX/urban [TEXT]"],
    accessableby: "Villagers",
    aliases: ["urban", "define", "ud"]
}