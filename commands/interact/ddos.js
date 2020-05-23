module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }
    let user;
    if (!args.join(" ")) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    } else {
        if (args.join(" ").toLowerCase() === `owner`) {
            user = message.guild.owner.user;
        } else {
            user = message.mentions.users.first() || await client.send.getUser(args.join(" "));
        }
        if (!user) return message.channel.send(`I was unable to get the user's information.`);
    }
    if (user) {
        message.delete();
    }
    const loader = client.emojis.cache.get(client.util.emoji.ddos).toString();
    const msg = await message.channel.send(`${loader} Initializing DDoS ${loader}`);
    let randm = Math.floor(Math.random() * 7891011) + 123456;
    setTimeout(function () {
        msg.edit(`${loader} Target Information Acquiring... ${loader}`)
    }, 2000);
    setTimeout(function () {
        msg.edit(`${loader} Target Information Acquired. ${loader}`)
    }, 5000);
    setTimeout(function () {
        msg.edit(`${loader} Obtaining Target's IP Addresses... ${loader}`)
    }, 10000);
    setTimeout(function () {
        msg.edit(`${loader} Obtained Target's IP Addresses. ${loader}`)
    }, 15000);
    setTimeout(function () {
        msg.edit(`${loader} DDoSing Target From ${randm} Host Servers. ${loader}`)
    }, 20000);
    setTimeout(function () {
        msg.edit(`Target ${user} has been DDoSed and all current infomation has been leaked`)
    }, 25000);
    await user.send(`You are currently under a DDoS attack all of ur infomation has been leaked out to hackers accross the world, your credit card details, your address, your pasports and your phone number. You have also been given criminal records and false hostage claims have been given to the police, be expecting a SWAT team at your house within 30 minutes, Don't tell anyone about this or else.\nFAKE BTW! Triggerd by: ${message.author.toString()}`);
    return client.send.log(message);
}

module.exports.code = {
    name: "ddos",
    description: "Fake DDoS attack",
    group: "interact",
    usage: ["/PREFIX/ddos [USER]"],
    accessableby: "Villagers",
    aliases: ["ddos"]
}