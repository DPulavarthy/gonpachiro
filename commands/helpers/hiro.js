module.exports.run = async (client, message, args, prefix) => {
    await message.channel.send(client.src.code(`The \`${prefix}/hiro\` functions hold a sacred set commands only usable by the highest of powers approved by the creators. These commands are not open to mere members. There are many uses for these commands, you can change Jonin's status & activity, view the logs, shut down Jonin, and some other complex functions. But even the \`${prefix}/hiro\` users a.k.a. Gonpachiro users cannot use some of the creator commands.. there are a few creator commands such as \`${prefix}read\` and \`${prefix}eval\`, but only 0.000000001% of discord users will ever see what they does.`));
    return client.log(message);
}

module.exports.code = {
    title: "/hiro",
    about: "Definition of the hiro group",
    usage: ["%P%hiro"],
    dm: true,
}