const package = require(`../../package.json`);
const cmds = require(`../../count.json`);

module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let loading = await message.channel.send(client.send.loading()),
        emoji = client.util.emoji,
        online = await client.users.cache.filter(c => c.presence.status === "online").map(c => c).length,
        idle = await client.users.cache.filter(c => c.presence.status === "idle").map(c => c).length,
        dnd = await client.users.cache.filter(c => c.presence.status === "dnd").map(c => c).length,
        streaming = await client.users.cache.filter(c => c.presence.status === "streaming").map(c => c).length,
        offline = await client.users.cache.filter(c => c.presence.status === "offline").map(c => c).length;
    try {
        const embed = client.send.embed()
            .setAuthor(`${client.user.username}'s Source`, client.util.link.logo, client.util.link.support)
            .setThumbnail(client.util.link.pfp)
            .addField(`Information`,
                `Prefix: ${client.config.prefix}` + `\n` +
                `Backup Prefix: ${client.config.back_up}` + `\n` +
                `Username: ${client.user.tag}` + `\n` +
                `ID: ${client.user.id}` + `\n` +
                `Main: ${package.main}` + `\n` +
                `Command count: ${client.send.getCMD().toLocaleString()}` + `\n` +
                `Lines of code: ${client.send.getLines().toLocaleString()}` + `\n` +
                `Command usage count: ${cmds.count.toLocaleString()}` + `\n` +
                `Creator: ${client.util.name.creator}` + `\n` +
                `Co-creator: ${client.util.name.co_creator}` + `\n` +
                `Library: Discord.JS v${require(`discord.js`).version}` + `\n` +
                `Process version: Node.JS ${process.version}` + `\n` +
                `Current version: v${package.version}` + `\n` +
                `Number of Servers: ${client.guilds.cache.size.toLocaleString()}` + `\n` +
                `Number of Channels: ${client.channels.cache.size.toLocaleString()}` + `\n` +
                `Number of Users: ${client.users.cache.size.toLocaleString()}` + `\n` +
                `${client.emojis.cache.get(emoji.green).toString()}Users Online: ` + online.toLocaleString() + `\n` +
                `${client.emojis.cache.get(emoji.yellow).toString()}Users Idle: ` + idle.toLocaleString() + `\n` +
                `${client.emojis.cache.get(emoji.red).toString()}Users DND: ` + dnd.toLocaleString() + `\n` +
                `${client.emojis.cache.get(emoji.purple).toString()}Users Streaming: ` + streaming.toLocaleString() + `\n` +
                `${client.emojis.cache.get(emoji.grey).toString()}Users Offline: ` + offline.toLocaleString(), true)
            .setImage(client.util.link.widget)
        await loading.edit(embed);
        return client.send.log(message);
    } catch (error) {
        console.log(error);
        client.send.report(message, error);
        return client.send.log(message);
    }
}

module.exports.code = {
    name: "source",
    description: "/BOT/'s information and number counts",
    group: "information",
    usage: ["/PREFIX/source"],
    accessableby: "Villagers",
    aliases: ["source", "botinfo"]
}