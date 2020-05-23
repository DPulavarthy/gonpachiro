module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let author,
        user;
    if (!args.join(" ")) {
        author = client.user.username;
        user = message.author.username;
    } else {
        if (args.join(" ").toLowerCase() === `owner`) {
            author = message.author.username;
            user = message.guild.owner.user.username;
        } else {
            author = message.author.username;
            user = message.mentions.users.first() || await client.send.getUser(args.join(" "));
        }
        if (!user) {
            return message.channel.send(`I was unable to get the user's information.`);
        } else {
            user = user.username;
        }
    }

    let msg = [
        `AUTHOR killed USER by suffocation!`,
        `AUTHOR covered USER in meat sauce and threw them into a cage with an starved tiger...`,
        `AUTHOR killed USER with a cheese grater`,
        `AUTHOR made USER drink fly spray`,
        `AUTHOR made USER eat too much ice cream 🍦🍦🍦`,
        `AUTHOR buried USER`,
        `AUTHOR taught USER how to drive a car... off a cliff`,
        `AUTHOR ran over USER with a unicycle`,
        `AUTHOR stabbed USER with a knife 🔪`,
        `AUTHOR stabbed USER with a pencil ✏️`,
        `AUTHOR killed USER by thousands of papercuts`,
        `AUTHOR punctured USER's heart with a rusty spoon`,
        `AUTHOR deprived USER of water`
    ];



    const randNum = Math.floor(Math.random() * (msg.length));
    await message.channel.send(msg[randNum].replace(/AUTHOR/g, author).replace(/USER/g, user));
    return client.send.log(message, randNum);
}

module.exports.code = {
    name: "kill",
    description: "Kill message to [USER] / Author",
    group: "interact",
    usage: ["/PREFIX/kill [USER]"],
    accessableby: "Villagers",
    aliases: ["kill", "die", "kms"]
}