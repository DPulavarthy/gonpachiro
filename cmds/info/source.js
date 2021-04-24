const package = require(`../../package.json`);

module.exports.run = async (client, message, args, guild) => {
    let field = [], loading = await message.channel.send(client.src.loading()),
        online = await client.users.cache.filter(c => c.presence.status === "online").map(c => c).length,
        idle = await client.users.cache.filter(c => c.presence.status === "idle").map(c => c).length,
        dnd = await client.users.cache.filter(c => c.presence.status === "dnd").map(c => c).length,
        streaming = await client.users.cache.filter(m => m.presence.activities.length !== 0).filter(m => m.presence.activities[0].type === "STREAMING").size,
        offline = await client.users.cache.filter(c => c.presence.status === "offline").map(c => c).length;
    client.db.findOne({ case: `count` }, async function (error, result) {
        if (error) { client.error(error); };
        if (message.channel.type !== `dm`) { client.database.guilds.findOne({ id: message.guild.id }, async function (error, res) { if (error) { client.error(error); }; if (!res) { return source(result.data); } else { return source(result.data, res.count); } }) } else { return source(result.data); };
    })

    function source(commands, guild) {
        field.push(`Prefix: ${guild.prefix}`);
        if (prefix !== guild.prefix) { field.push(`Server prefix: ${guild.prefix}`); }
        field.push(`Username: ${client.user.tag}`);
        field.push(`ID: ${client.user.id}`);
        field.push(`Main: ${package.main}`);
        field.push(`Command count: ${client.commands.size.toLocaleString()}`);
        field.push(`Lines of code: ${client.lines.toLocaleString()}`);
        field.push(`Characters in code: ${client.length.toLocaleString()}`);
        field.push(`Command usage count: ${commands.toLocaleString()}`);
        field.push(`Server Command usage: ${guild ? guild.toLocaleString() : `N/A`}`);
        field.push(`Creator: ${client.users.cache.get(client.util.id.creator.id).tag}`);
        field.push(`Co-creator: ${client.users.cache.get(client.util.id.cocreator.id).tag}`);
        field.push(`Library: Discord.JS v${require(`discord.js`).version}`);
        field.push(`Process version: Node.JS ${process.version}`);
        field.push(`Current version: v${package.version}`);
        field.push(`Number of Servers: ${client.guilds.cache.size.toLocaleString()}`);
        field.push(`Number of Channels: ${client.channels.cache.size.toLocaleString()}`);
        field.push(`Number of Users: ${client.users.cache.size.toLocaleString()}`);
        field.push(`${client.emojis.cache.get(client.emoji.green).toString()}Users Online: ${online.toLocaleString()}`);
        field.push(`${client.emojis.cache.get(client.emoji.yellow).toString()}Users Idle: ${idle.toLocaleString()}`);
        field.push(`${client.emojis.cache.get(client.emoji.red).toString()}Users DND: ${dnd.toLocaleString()}`);
        field.push(`${client.emojis.cache.get(client.emoji.purple).toString()}Users Streaming: ${streaming.toLocaleString()}`);
        field.push(`${client.emojis.cache.get(client.emoji.grey).toString()}Users Offline: ${offline.toLocaleString()}`);
        const embed = client.embed()
            .setAuthor(`${client.user.username}'s Source`)
            .setThumbnail(client.user.avatarURL({ format: "png", dynamic: true, size: 2048 }))
            .setDescription(field.join(`\n`))
            .setImage(client.util.link.widget)
        setTimeout(async () => { await loading.edit(embed); }, 1000);
        return client.log(message);
    }
}

module.exports.code = {
    title: "source",
    about: "%B%'s quick info",
    usage: ["%P%source"],
    alias: ["botinfo"]
}