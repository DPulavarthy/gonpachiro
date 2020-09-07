module.exports.run = async (client, message, args, prefix) => {
    if (!args.join(` `) || !args[0] || !args[1]) { return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    try { client.users.cache.get(args[0]).send(`\`${message.author.tag} (My Owner) sent this message:\` ${args.splice(1).join(` `)}`); message.channel.send(client.src.embed().setTitle(client.src.comment(`Message Successfully Sent!`))) }
    catch (error) { message.channel.send(client.src.comment(`ERROR: ${error}`)) }
}

module.exports.code = {
    title: "dm",
    about: "DMs [USER_ID] with given [MESSAGE]",
    usage: ["%P%dm [USER_ID] [MESSAGE]"],
    ranks: 8,
    dm: true,
}