let [cleverbot, translate] = [require(`cleverbot-free`), require(`google-translate-free`)]

module.exports.run = async (client, message, args, guild, noquote) => {
    message.channel.startTyping()
    let history = client.chat.get(message.author.id)
    switch (!history) {
        case true: {
            client.chat.set(message.author.id, [])
            let data = client.chat.get(message.author.id)
            cleverbot(args.join(` `)).then(async response => chat(response, data))
            break
        }
        case false: {
            let data = client.chat.get(message.author.id)
            cleverbot(args.join(` `), data).then(async response => chat(response, data.length > 20 ? data.splice(2) : data))
            break
        }
    }

    async function chat(response, data) {
        switch (!guild.translate) {
            case true: {
                data.push(args.join(` `))
                data.push(response)
                if (noquote) webhook(response)
                else message.channel.send(`> ${args.join(` `).length + response.length + 2 > 2000 ? `${args.join(` `).substring(0, 1995 - response.length)}...` : args.join(` `)}\n${response}`)
                client.chat.set(message.author.id, data)

                break
            }
            case false: {
                translate(response, { to: guild.translate }).then(res => {
                    response = res.text
                    data.push(args.join(` `))
                    data.push(response)
                    if (noquote) webhook(response)
                    else message.channel.send(`> ${args.join(` `).length + response.length + 2 > 2000 ? `${args.join(` `).substring(0, 1995 - response.length)}...` : args.join(` `)}\n${response}`)
                    client.chat.set(message.author.id, data)
                }).catch(async error => {
                    client.error(error)
                    response = `I don't know`
                    data.push(args.join(` `))
                    data.push(response)
                    if (noquote) webhook(response)
                    else message.channel.send(`> ${args.join(` `).length + response.length + 2 > 2000 ? `${args.join(` `).substring(0, 1995 - response.length)}...` : args.join(` `)}\n${response}`)
                    client.chat.set(message.author.id, data)
                })
                break
            }
        }
    }

    async function webhook(response) {
        try {
            let webhooks = await message.channel.fetchWebhooks()
            let webhook = webhooks.first()
            if (!webhook) webhook = await message.channel.createWebhook(`Nitro Mockup, by ${client.user.username}`)
            if (!webhook) return message.channel.send(`Missing Permissions: \`Manage Webhooks\``)
            await webhook.send(response, {
                username: `${message.guild.members.cache.get(client.user.id).displayName}, replying to ${message.guild.members.cache.get(message.author.id).displayName}`,
                avatarURL: client.user.avatarURL({ format: "png" }),
            })
        } catch (error) { message.channel.send(`Error: \`${error}\``) }
    }
}

module.exports.code = {
    title: "chat",
    about: "A chatbot",
    usage: ["%P%j [TEXT]"],
    alias: ["j"]
}