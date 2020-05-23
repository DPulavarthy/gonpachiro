const DBL = require("dblapi.js");

module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const dbl = new DBL(client.util.api.dbl, client);

    if (!client.send.approve(message.author.id, `APPROVED`)) {
        client.send.restrict(message, 14);
        return client.send.log(message, `hiro`);
    } else {
        let loading = await message.react(client.emojis.cache.get(client.util.emoji.loading)),
            home = await client.guilds.cache.get(client.util.id.guild);
            home.channels.cache.get(client.util.id.member_count).setName(`Members: ${home.memberCount}`).catch(error => send.report(message, error));
            home.channels.cache.get(client.util.id.guild_count).setName(`Guilds: ${client.guilds.cache.size}`).catch(error => send.report(message, error));
            home.channels.cache.get(client.util.id.channel_count).setName(`Channel Count: ${home.channels.cache.size}`).catch(error => send.report(message, error));
        dbl.getBot(client.util.id.client).then(async data => {
            home.channels.cache.get(client.util.id.total_vote).setName(`Total Upvotes: ${data.points}`).catch(error => send.processes(error));
            home.channels.cache.get(client.util.id.month_vote).setName(`Monthly Upvotes: ${data.monthlyPoints}`).catch(error => send.processes(error));
        })
        client.user.setStatus(`online`); // Categories: online, idle, dnd, invisible
        client.user.setActivity(`${client.guilds.cache.size} guilds | ${client.config.prefix}help`, { type: `WATCHING` }); // Categories: PLAYING, STREAMING, LISTENING, WATCHING
        dbl.postStats(client.guilds.size);
        await loading.remove();
        await message.react(client.emojis.cache.get(client.util.emoji.check));
        return client.send.log(message, `hiro`);
    }
}

module.exports.code = {
    name: "/hirofix",
    description: "Quick refresh of client",
    group: "devs",
    usage: ["/PREFIX//hirofix"],
    accessableby: "Gonpachiro",
    aliases: ["/hirofix", "/hirorefresh"]
}