let moment = require(`moment`)
require(`moment-duration-format`)(moment)

module.exports.run = async (client, message, args, guild) => {
    let [user, field, status] = [await client.src.userlist(message, args), []]
    if (user.length < 1) return client.src.invalid(message, module.exports.code.title, guild)
    user = await client.users.cache.get(user[0].id)
    let member = await message.guild.members.cache.get(user.id)
    switch (user.presence.status.toUpperCase()) {
        case `ONLINE`: {
            status = String.fromCodePoint(128994)
            break
        }
        case `IDLE`: {
            status = String.fromCodePoint(128993)
            break
        }
        case `DND`: {
            status = String.fromCodePoint(128308)
            break
        }
        case `STREAMING`: {
            status = String.fromCodePoint(128995)
            break
        }
        default: {
            status = String.fromCodePoint(9898)
            break
        }
    }
    field.push(`\u279c Username: [${user.username}](https://discord.com/users/${user.id}) ${user.username !== member.displayName ? `\n\u279c Nickname: ${member.displayName}` : ``}`)
    field.push(`\u279c ID: ${user.id}`)
    field.push(`\u279c Server Owner: ${user.id === message.guild.owner.id ? `Yes` : `No`}`)
    field.push(`\u279c Bot: ${user.bot ? `Yes` : `No`}`)
    field.push(`\u279c Account Created: ${moment.duration(new Date().getTime() - new Date(user.createdAt).getTime()).format(`w [Weeks], d [Days], h [Hours], m [Minutes] ago`)}`)
    field.push(`\u279c Joined Server: ${moment.duration(new Date().getTime() - new Date(member.joinedAt).getTime()).format(`w [Weeks], d [Days], h [Hours], m [Minutes] ago`)}`)
    field.push(`\u279c Number of roles: ${member.roles.cache.size}`)
    field.push(`\u279c Join rank: ${client.src.rank(message, user.id)}`)
    field.push(`\u279c Status: \`${status} - ${user.presence.status}\``)
    let embed = client.comment(`${status} ${user.tag}`)
        .setImage(user.avatarURL({ format: "png", dynamic: true, size: 2048 }))
        .setDescription(field)
    return message.channel.send(embed)
}

module.exports.code = {
    title: "info",
    about: "Get the info of (USER)",
    usage: ["%P%info (USER)"],
    alias: ["profile", "whois"],
}