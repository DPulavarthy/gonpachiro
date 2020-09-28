const moment = require(`moment`);
require(`moment-duration-format`)(moment);

module.exports.run = async (client, message, args, guild) => {
    let r = { "brazil": ":flag_br: Brazil", "eu-central": ":flag_eu: Central Europe", "singapore": ":flag_sg: Singapore", "us-central": ":flag_us: U.S. Central", "sydney": ":flag_au: Sydney", "us-east": ":flag_us: U.S. East", "us-south": ":flag_us: U.S. South", "us-west": ":flag_us: U.S. West", "eu-west": ":flag_eu: Western Europe", "vip-us-east": ":flag_us: VIP U.S. East", "london": ":flag_gb: London", "amsterdam": ":flag_nl: Amsterdam", "hongkong": ":flag_hk: Hong Kong", "russia": ":flag_ru: Russia", "southafrica": ":flag_za:  South Africa" },
        online = await message.guild.members.cache.filter(c => c.presence.status === "online").map(c => c).length,
        idle = await message.guild.members.cache.filter(c => c.presence.status === "idle").map(c => c).length,
        dnd = await message.guild.members.cache.filter(c => c.presence.status === "dnd").map(c => c).length,
        streaming = await message.guild.members.cache.filter(m => m.user.presence.activities.length !== 0).filter(m => m.user.presence.activities[0].type === "STREAMING").size,
        offline = await message.guild.members.cache.filter(c => c.presence.status === "offline").map(c => c).length,
        field = [];

    client.database.guilds.findOne({ id: message.guild.id }, async function (error, result) {
        if (error) { client.error(error); };
        field.push(`${client.arrow} Name: ${message.guild.name}`);
        field.push(`${client.arrow} ID: ${message.guild.id}`);
        field.push(`${client.arrow} Region: ${r[message.guild.region]}`);
        field.push(`${client.arrow} Verification lvl: ${message.guild.verificationLevel}`);
        field.push(`${client.arrow} Member counts`);
        field.push(`${client.blank} Total: ${message.guild.memberCount}`);
        field.push(`${client.blank} Humans: ${message.guild.members.cache.filter(member => !member.user.bot).size}`);
        field.push(`${client.blank} Bots: ${message.guild.members.cache.filter(member => member.user.bot).size}`);
        field.push(`${client.arrow} Server stats`);
        field.push(`${client.blank} Guilds: 1`);
        field.push(`${client.blank} Channels: ${message.guild.channels.cache.size}`);
        field.push(`${client.blank} Roles: ${message.guild.roles.cache.size}`);
        field.push(`${client.arrow} Member stats`);
        field.push(`${client.blank} ${client.emojis.cache.get(client.util.emoji.green).toString()}Online: ${online}`);
        field.push(`${client.blank} ${client.emojis.cache.get(client.util.emoji.yellow).toString()}Idle: ${idle}`);
        field.push(`${client.blank} ${client.emojis.cache.get(client.util.emoji.red).toString()}DND: ${dnd}`);
        field.push(`${client.blank} ${client.emojis.cache.get(client.util.emoji.purple).toString()}Streaming: ${streaming}`);
        field.push(`${client.blank} ${client.emojis.cache.get(client.util.emoji.grey).toString()}Offline: ${offline}`);
        if (result) {
            field.push(`${client.arrow} Data stats`);
            field.push(`${client.blank} Nitro Mock-up: ${result.nitro ? `Enabled` : `Disabled`}`);
            let channel = message.guild.channels.cache.get(result.log);
            field.push(`${client.blank} Log Channel: ${channel ? channel.toString() : `ERROR, Log channel not found`}`);
            field.push(`${client.blank} Server Prefix: ${result.prefix !== client.prefix ? result.prefix : `Default`}`);
            field.push(`${client.blank} Command usage count: ${result.count.toLocaleString()}`);
            field.push(`${client.blank} Game Badges count: ${result.badges.length.toLocaleString()}`);
            field.push(`${client.blank} Attacked guilds count: ${result.attacked.length.toLocaleString()}`);
            field.push(`${client.blank} Valks count: ${result.data.length.toLocaleString()}`);
        }
        field.push(`${client.arrow} Server created: ${moment.duration(new Date().getTime() - new Date(message.guild.createdAt).getTime()).format(`w [Weeks], d [Days], h [Hours], m [Minutes] ago`)}`);

        const embed = client.embed()
            .setAuthor(message.guild.name)
            .setDescription(field.join(`\n`))
            .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true, size: 2048 }));
        await message.channel.send(embed);
        return client.log(message);
    })
}

module.exports.code = {
    title: "server",
    about: "Information about the server",
    usage: ["%P%server"],
}