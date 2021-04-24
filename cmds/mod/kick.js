module.exports.run = async (client, message, args, guild) => {
    let user = message.mentions.users.first()
    if (!user) return client.src.invalid(message, module.exports.code.title, guild)
    let member = message.guild.members.cache.get(user.id)
    if (!member) return message.channel.send(client.comment(`CODE 09: Mentioned a user not in the server`))
    if (!message.guild.members.cache.get(message.author.id).hasPermission(`KICK_MEMBERS`)) return message.channel.send(client.comment(`CODE 01: You do not have the following permission: KICK_MEMBERS`))
    if (!message.guild.members.cache.get(client.user.id).hasPermission(`KICK_MEMBERS`)) return message.channel.send(client.comment(`CODE 01: I do not have the following permission: KICK_MEMBERS`))
    if (!user.id === message.guild.owner.id) return message.channel.send(client.comment(`CODE 07: Cannot kick server owner`))
    if (!member.kickable) return message.channel.send(client.comment(`CODE 02: Member cannot be kicked\n(Make sure ${client.user.username}'s role is higher than the one you want to kick)`))
    if (user.id === message.author.id) return message.channel.send(client.comment(`CODE 07: You cannot kick yourself`))
    let [reason, field] = [args.slice(1).join(` `), []]
    field.push(`\u279c Username: [${user.tag}](https://discord.com/users/${user.id})[${user.id}]`)
    field.push(`\u279c Triggered by: ${message.author.tag}[${message.author.id}]`)
    field.push(`\u279c Server Name: ${message.guild.name}`)
    field.push(`\u279c Reason: ${reason || `N/A`}`)
    try {
        member.kick().then(async () => {
            let dm = true
            try { await client.users.cache.get(user.id).send(client.embed().setTitle(`You have been Kicked!`).setDescription(field)) }
            catch (error) { dm = !dm }
            return message.channel.send(client.embed().setTitle(`User Kick Successful`).setDescription(`${field.join(`\n`)}\n\u279c Notified User: ${dm ? `Yes` : `No`}`))
        })
    } catch (error) {
        client.error(error)
        return message.channel.send(client.embed().setTitle(`User Kick Failed`).setDescription(`${field.join(`\n`)}\n\u279c Error: ${error}`))
    }
}

module.exports.code = {
    title: "kick",
    about: "Kicks [USER] from guild",
    usage: ["%P%kick [USER] (REASON)"]
}
