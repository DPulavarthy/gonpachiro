module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let input = args[0];
    if (parseInt(input) === `NaN`) {
        await message.channel.send(client.send.error(`Input an integer`))
        return client.send.log(message)
    }

    if (!input) {
        input = 6;
    }

    let result = (Math.floor(Math.random() * (Math.floor(input)) + 1));
    const embed = client.send.embed()
        .setAuthor(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL(), client.util.link.support)
        .setDescription(`You rolled ${result}!`);
    await message.channel.send(embed);
    return client.send.log(message);
}

module.exports.code = {
    name: "diceroll",
    description: "Random dice roll, 6 if no (MAX NUM) is provided",
    group: "interact",
    usage: ["/PREFIX/diceroll (MAX NUM)"],
    accessableby: "Villagers",
    aliases: ["diceroll", "dr"]
}