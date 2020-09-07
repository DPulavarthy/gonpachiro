module.exports.run = async (client, message, args) => {
    let num = 6;
    if (!parseInt(args.join(` `)) || isNaN(parseInt(args.join(` `)))) { message.channel.send(client.src.comment(`Input an integer`)); return client.log(message); }
    else { num = parseInt(args.join(` `)); };
    message.channel.send(client.embed().setAuthor(`Requested by: ${message.author.tag}`, message.author.avatarURL({ format: "png", dynamic: true, size: 2048 })).setDescription(`You rolled ${Math.floor(Math.random() * (Math.floor(num)) + 1)}!`));
    return client.log(message);
}

module.exports.code = {
    title: "diceroll",
    about: "Random dice roll, 6 if no (MAX NUM) is provided",
    usage: ["%P%diceroll (MAX NUM)"],
    alias: ["dr"],
    dm: true,
}