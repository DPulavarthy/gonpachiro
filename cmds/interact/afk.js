let moment = require("moment")
require(`moment-duration-format`)(moment)

module.exports.run = async (client, message, args, guild) => {
    if (args.join(` `) && args.join(` `).toUpperCase() === `END`) { // End AFK
        client.db._data.findOne({ case: module.exports.code.title }, async function (error, result) {
            if (error) client.error(error)
            if (!result) { return client.src.db(message, module.exports.code.title); };
            let [status, field] = [result.data.find(user => user.auth === message.author.id), []]
            if (status) {
                field.push(`\u279c User: ${message.author.tag}`)
                field.push(`\u279c ID: ${message.author.id}`)
                field.push(`\u279c Duration: ${moment.duration(new Date().getTime() - status.time).format(`w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds]`)}`)
                field.push(`\u279c Reason: ${status.data}`)
                field.push(`\u279c Locked: ${status.lock ? `Yes` : `No`}`)
                result.data = result.data.filter(user => user.auth !== message.author.id)
                let msg = await message.channel.send(client.embed().setTitle(`AFK status ended`).setDescription(field.join(`\n`)))
                let res = { $set: { data: result.data } }
                client.db._data.updateOne({ case: module.exports.code.title }, res, function (error) {
                    if (error) client.error(error)
                })
                setTimeout(async () => msg.delete(), 15 * 1000)
            } else {
                message.channel.send(client.src.comment(`You are not currently AFK, use \'${guild.prefix}${module.exports.code.title}\' to start your AFK status, \'${guild.prefix}explain ${module.exports.code.title}\' for more information.`))
                return message.react(client.emojis.cache.get(client.emoji.cross))
            }
        })
    } else { // Start AFK
        client.db._data.findOne({ case: module.exports.code.title }, async function (error, result) {
            if (error) client.error(error)
            if (!result) return client.src.db(message, module.exports.code.title)
            for await (let status of result.data) {
                if (status.auth === message.author.id && !args.join(` `)) {
                    message.channel.send(client.src.comment(`You are currently AFK, use \'${guild.prefix}${module.exports.code.title} end\' to end your AFK status, \'${guild.prefix}explain ${module.exports.code.title}\' for more information.`))
                    return message.react(client.emojis.cache.get(client.emoji.cross))
                } else if (status.auth === message.author.id) {
                    result.data = result.data.filter(user => user.auth !== message.author.id)
                    let field = { lock: status.lock, auth: status.auth, time: status.time, data: args.join(` `), }
                    message.channel.send(client.src.comment(`\u279c Status updated to: ${args.join(` `)}`))
                    result.data.push(field)
                    let res = { $set: { data: result.data } }
                    client.db._data.updateOne({ case: module.exports.code.title }, res, function (error) {
                        if (error) {
                            client.src.error(error)
                            message.react(client.emojis.cache.get(client.emoji.cross))
                        } else return message.react(client.emojis.cache.get(client.emoji.check))
                    })
                }
            }
            let field = { lock: false, auth: message.author.id, time: new Date().getTime(), data: `N/A`, }
            field.lock = args[0] && args[0].toUpperCase() === `-LOCK` ? true : false
            field.data = field.lock ? `${args.splice(1).join(` `) || `N/A`}` : `${args.join(` `) || `N/A`}`
            result.data.push(field)
            let res = { $set: { data: result.data } }
            client.db._data.updateOne({ case: module.exports.code.title }, res, function (error) {
                if (error) {
                    client.src.error(error)
                    message.react(client.emojis.cache.get(client.emoji.cross))
                } else return message.react(client.emojis.cache.get(client.emoji.check))
            })
        })
    }
}

module.exports.code = {
    title: "afk",
    about: "Set an AFK status, lock = keep AFK status even if you send a message",
    usage: ["%P%afk (-lock) (reason)", "%P%afk end"],
    dm: true,
}