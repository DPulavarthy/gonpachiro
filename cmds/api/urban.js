const { Profanity, ProfanityOptions } = require(`@2toad/profanity`)
const options = new ProfanityOptions()
options.wholeWord = true
options.grawlix = `\\\*\\\*\\\*\\\*\\\*`
const profanity = new Profanity(options)

module.exports.run = async (client, message, args, guild) => {
    if (!args[0]) return client.src.invalid(message, module.exports.code.title, guild)
    require(`urban`)(args.join(` `)).first(async data => {
        if (!data) return message.channel.send(client.embed().setTitle(`No such word exists on the Urban Dictionary!`).addField(`Define the word for others to know`, `[Make a new word](https://www.urbandictionary.com/add.php)`))
        let body = `[\`${String.fromCodePoint(128077)}: ${data.thumbs_up} | ${String.fromCodePoint(128078)}: ${data.thumbs_down}\`](${data.permalink})\n${profanity.censor(data.definition)}`
        if (body.length > 2000) body = `${def.substring(0, 1997)}...`
        return message.channel.send(client.embed().setAuthor(`Definition of: ${data.word}`, null, client.util.link.support).setDescription(body))
    })
}

module.exports.code = {
    title: "urban",
    about: "Definiton of [TEXT]",
    usage: ["%P%urban [TEXT]"]
}