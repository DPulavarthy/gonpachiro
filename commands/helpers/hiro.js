module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    await message.channel.send(`\`\`\`\nThe \`${client.config.prefix}/hiro\` functions hold a sacred set commands only usable by the highest of powers approved by the creators. These commands are not open to mere members. There are many uses for these commands, you can change Jonin's status & activity, view the logs, shut down Jonin, and some other complex functions. But even the \`${client.config.prefix}/hiro\` users a.k.a. Gonpachiro users cannot use some of the creator commands.. there are a few creator commands such as \`${client.config.prefix}read\` and \`${client.config.prefix}eval\`, but only 0.000000001% of discord users will ever see what they does.\n\`\`\``);
    return client.send.log(message, `hiro`)
}

module.exports.code = {
    name: "/hiro",
    description: "Definition of the hiro group",
    group: "helpers",
    usage: ["/PREFIX//hiro"],
    accessableby: "Villagers",
    aliases: ["/hiro"]
}