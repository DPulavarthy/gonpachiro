module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let fields = [], emojis = { 0: [] }, counter = 0
    message.guild.emojis.cache.filter(c => c.animated).forEach((emoji, index) => {
        if (emojis[counter].join('\n').length > 950) {
            if (++index === message.guild.emojis.cache.filter(c => c.animated).size) {
                emojis[counter].push(`${emoji.toString()}\`:${emoji.name}:\``)
            } else {
                counter++
                emojis[counter] = []
            }
        } else {
            emojis[counter].push(`${emoji.toString()}\`:${emoji.name}:\``)
        }
    })
    if (emojis[0].join('').length !== 0) {
        Object.keys(emojis).forEach((col, index) => {
            if (index !== 0) {
                fields.push({
                    name: '\u200b',
                    value: emojis[index].join("\n")
                })
            } else {
                fields.push({
                    name: '\u200b',
                    value: emojis[index].join("\n")
                })
            }
        })
    } else {
        fields.push({
            name: '\u200b',
            value: '**None**'
        })
    }
    let embed = client.send.embed()
        .setTitle(`Animated Emoji list for ${message.guild.name}`)
        .setDescription(`Users without nitro can use \`:EMOJI_NAME:\` to make the bot send the emoji and get you to the clostest to nitro as possible! Below is a list of animated emojis for ${message.guild.name}, don't forget about the \`:colons:\``)
    // Do whatever to the embed.
    for await (const field of fields) {
        embed.addField(field.name, field.value, true);
    }
    message.channel.send(embed);
}

module.exports.code = {
    name: "ael",
    description: "Emoji list for animated emotes",
    group: "helpers",
    usage: ["/PREFIX/ael"],
    accessableby: "Villagers",
    aliases: ["ael", "aniemotelist", "animatedemojilist"]
}