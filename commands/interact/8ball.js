module.exports.run = async (client, message) => {
    let random = [`As I see it, yes.`, `Ask again later.`, `Better not tell you now.`, `Cannot predict now.`, `Concentrate and ask again.`, `Don’t count on it.`, `It is certain.`, `It is decidedly so.`, `Most likely.`, `My reply is no.`, `My sources say no.`, `Outlook not so good.`, `Outlook good.`, `Reply hazy, try again.`, `Signs point to yes.`, `Very doubtful.`, `Without a doubt.`, `Yes.`, `Yes – definitely.`, `You may rely on it.`];
    message.channel.send(random[Math.floor(Math.random() * (random.length))]);
    return client.log(message);
}

module.exports.code = {
    title: "8ball",
    about: "A random decision",
    usage: ["%P%8ball (TEXT)"],
    dm: true,
}