let translate = require(`google-translate-free`)

module.exports.run = async (client, message, args, guild) => {
    if (!args.join(` `)) return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about)
    client.db._guilds.findOne({ id: message.guild.id }, async (error, result) => {
        if (error) client.error(error)
        switch (!result || !result.translate) {
            case true: {
                convert(`en`)
                break
            }
            case false: {
                convert(result.translate)
                break
            }
        }
        function convert(lang) {
            translate(args.join(` `), { to: lang }).then(async res => {
                let embed = client.embed()
                    .setAuthor(`Requested by: ${message.author.tag}`, message.author.avatarURL({ format: "png", dynamic: true, size: 2048 }))
                    .setDescription(`${res.text}`)
                message.channel.send(embed)
            }).catch(async error => {
                client.error(error)
                let embed = client.embed()
                    .setAuthor(`Requested by: ${message.author.tag}`, message.author.avatarURL({ format: "png", dynamic: true, size: 2048 }))
                    .setDescription(`ERROR: ${error}`)
                message.channel.send(embed)
            })
        }
    })
}

module.exports.code = {
    title: "translate",
    about: "Translate's [TEXT] to server default",
    usage: ["%P%translate [TEXT]"]
}