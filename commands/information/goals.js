const package = require(`../../package.json`);
const DBL = require("dblapi.js");

module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const dbl = new DBL(client.util.api.dbl, client);
    const update = package.version.substring(2, 3) + package.version.substring(4);
    dbl.getBot(client.util.id.client).then(async data => {
        let patreon = 10;
        const embed = client.send.embed()
            .setTitle(`${client.user.username}'s Goals!`)
            //.addField(`${client.emojis.get(config.up_arrow).toString()} Want this message to go away??`, `Help us reach our goals!`, false)
            .addField(`Our Goals!`, `${client.users.cache.size}/100000 users\n${client.guilds.cache.size}/200 guilds\n${client.channels.cache.size}/7500 channels\n${data.monthlyPoints}/200 votes, [Vote here!](${client.util.link.vote})\n${patreon}/$100 donated, [Donate here!](${client.util.link.donate})`, false)
            .addField(`How you can help`, `[Invite ${client.user.username}](${client.util.link.invite}) to your servers!\n[Donate](${client.util.link.donate}) to the [devs](https://jonin.gq/about-us.html) for motivation!`, false)
            .addField(`Need help?`, `Join the [support server](${client.util.link.support}) or use the command ${client.config.prefix}support`, false)
            //.addField(`Version`, `${client.user.username} is on v${package.version}, ${client.user.username} has been updated ${update} times!`, false)
        message.channel.send(embed);
        return client.send.log(message);
    })
}

module.exports.code = {
    name: "goals",
    description: "Jonin's Goals",
    group: "information",
    usage: ["/PREFIX/goals"],
    accessableby: "Villagers",
    aliases: ["goals", "g", "goal"]
}