module.exports.run = async (client, message, args, prefix) => {
    if (!args.join(` `)) { return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    require(`urban`)(args.join(` `)).first(async json => {
        if (!json) { message.channel.send(client.embed().setTitle(`No such word exists on the Urban Dictionary!`).addField(`Define the word for others to know`, `[Make a new word](https://www.urbandictionary.com/add.php)`)); return client.log(message); };
        let def = json.definition;
        if (def.length > 2000) { def = `${def.substring(0, 1997)}...`; };
        await message.channel.send(client.embed().setTitle(`Definition of: ` + json.word).setURL(json.permalink).setDescription(def).addField('Upvotes', json.thumbs_up, true).addField('Downvotes', json.thumbs_down, true));
        return client.log(message);
    });

}

module.exports.code = {
    title: "urban",
    about: "Definiton of [TEXT]",
    usage: ["%P%urban [TEXT]"],
    alias: ["define"],
    nsfw: true,
    dm: true,
}