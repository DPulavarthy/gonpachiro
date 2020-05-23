const moment = require(`moment`);

module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let r = {
        "brazil": ":flag_br: Brazil",
        "eu-central": ":flag_eu: Central Europe",
        "singapore": ":flag_sg: Singapore",
        "us-central": ":flag_us: U.S. Central",
        "sydney": ":flag_au: Sydney",
        "us-east": ":flag_us: U.S. East",
        "us-south": ":flag_us: U.S. South",
        "us-west": ":flag_us: U.S. West",
        "eu-west": ":flag_eu: Western Europe",
        "vip-us-east": ":flag_us: VIP U.S. East",
        "london": ":flag_gb: London",
        "amsterdam": ":flag_nl: Amsterdam",
        "hongkong": ":flag_hk: Hong Kong",
        "russia": ":flag_ru: Russia",
        "southafrica": ":flag_za:  South Africa"
    },
        online = await message.guild.members.cache.filter(c => c.presence.status === "online").map(c => c).length,
        idle = await message.guild.members.cache.filter(c => c.presence.status === "idle").map(c => c).length,
        dnd = await message.guild.members.cache.filter(c => c.presence.status === "dnd").map(c => c).length,
        streaming = await message.guild.members.cache.filter(c => c.presence.status === "streaming").map(c => c).length,
        offline = await message.guild.members.cache.filter(c => c.presence.status === "offline").map(c => c).length,
        field = ``;

        field += `${client.arrow} Name: ${message.guild.name}\n`;
        field += `${client.arrow} ID: ${message.guild.id}\n`;
        field += `${client.arrow} Region: ${r[message.guild.region]}\n`;
        field += `${client.arrow} Verification lvl: ${message.guild.verificationLevel}\n`;
        field += `${client.arrow} Member counts\n`;
        field += `${client.blank}${client.arrow} Total: ${message.guild.memberCount}\n`;
        field += `${client.blank}${client.arrow} Humans: ${message.guild.members.cache.filter(member => !member.user.bot).size}\n`;
        field += `${client.blank}${client.arrow} Bots: ${message.guild.members.cache.filter(member => member.user.bot).size}\n`;
        field += `${client.arrow} Server stats\n`;
        field += `${client.blank}${client.arrow} Guilds: 1\n`;
        field += `${client.blank}${client.arrow} Channels: ${message.guild.channels.cache.size}\n`;
        field += `${client.blank}${client.arrow} Roles: ${message.guild.roles.cache.size}\n`;
        field += `${client.arrow} Member stats\n`;
        field += `${client.blank}${client.arrow} ${client.emojis.cache.get(client.util.emoji.green).toString()}Online: ${online}\n`;
        field += `${client.blank}${client.arrow} ${client.emojis.cache.get(client.util.emoji.yellow).toString()}Idle: ${idle}\n`;
        field += `${client.blank}${client.arrow} ${client.emojis.cache.get(client.util.emoji.red).toString()}DND: ${dnd}\n`;
        field += `${client.blank}${client.arrow} ${client.emojis.cache.get(client.util.emoji.purple).toString()}Streaming: ${streaming}\n`;
        field += `${client.blank}${client.arrow} ${client.emojis.cache.get(client.util.emoji.grey).toString()}Offline: ${offline}\n`;
        field += `${client.arrow} Server created: ${moment(new Date().getTime() - new Date(message.guild.createdAt).getTime()).format("w [Weeks], d [Days], h [Hours], m [Minutes]")} ago\n`;
        
    const embed = client.send.embed()
        .setAuthor(message.guild.name, message.guild.iconURL({ format: "png", dynamic: true, size: 2048 }))
        .setDescription(field)
        .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true, size: 2048 }));
    await message.channel.send(embed);
    return client.send.log(message);
}

module.exports.code = {
    name: "server",
    description: "Information about the server",
    group: "information",
    usage: ["/PREFIX/server"],
    accessableby: "Villagers",
    aliases: ["server"]
}