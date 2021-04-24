module.exports.run = async (client, message, args, guild) => {
    if (!args.join(` `) || !args[0] || !args[1]) return client.src.invalid(message, module.exports.code.title, guild)
    try {
        let user = await client.users.fetch(args[0])
        if (!user) return message.channel.send(client.comment(`ERROR: User not found!`))
        user.send(`\`${message.author.tag} (My Owner) sent this message:\` ${args.splice(1).join(` `)}`)
        message.channel.send(client.comment(`Message Successfully Sent!`))
    } catch (error) { message.channel.send(client.comment(`ERROR: ${error}`)) }
}

module.exports.code = {
    title: "dm",
    about: "DMs [USER_ID] with given [MESSAGE]",
    usage: ["%P%dm [USER_ID] [MESSAGE]"]
}