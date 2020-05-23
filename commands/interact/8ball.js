module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let random = [
        `As I see it, yes.`,
        `Ask again later.`,
        `Better not tell you now.`,
        `Cannot predict now.`,
        `Concentrate and ask again.`,
        `Don’t count on it.`,
        `It is certain.`,
        `It is decidedly so.`,
        `Most likely.`,
        `My reply is no.`,
        `My sources say no.`,
        `Outlook not so good.`,
        `Outlook good.`,
        `Reply hazy, try again.`,
        `Signs point to yes.`,
        `Very doubtful.`,
        `Without a doubt.`,
        `Yes.`,
        `Yes – definitely.`,
        `You may rely on it.`
    ];

    const randNum = Math.floor(Math.random() * (random.length));
    await message.channel.send(random[randNum]);
    return client.send.log(message, randNum);
}

module.exports.code = {
    name: "8ball",
    description: "A random decision",
    group: "interact",
    usage: ["/PREFIX/8ball (TEXT)"],
    accessableby: "Villagers",
    aliases: ["8ball", "8"]
}