let moment = require(`moment`)
require(`moment-duration-format`)(moment)

module.exports.run = async (client, message, args, guild) => {
    let [online, idle, dnd, streaming, offline, user, region, field, blacklist, chatlist] = [
        await message.guild.members.cache.filter(c => c.presence.status === `online`).map(c => c),
        await message.guild.members.cache.filter(c => c.presence.status === `idle`).map(c => c),
        await message.guild.members.cache.filter(c => c.presence.status === `dnd`).map(c => c),
        await message.guild.members.cache.filter(m => m.user.presence.activities.length !== 0).filter(m => m.user.presence.activities[0].type === `STREAMING`).map(c => c),
        await message.guild.members.cache.filter(c => c.presence.status === `offline`).map(c => c),
        await guild.premium && typeof guild.premium === `string` ? await client.users.fetch(guild.premium) : false,
        {
            brazil: `\uD83C\uDDE7\uD83C\uDDF7 Brazil`,
            eucentral: `\uD83C\uDDEA\uD83C\uDDFA Central Europe`,
            singapore: `\uD83C\uDDF8\uD83C\uDDEC Singapore`,
            uscentral: `\uD83C\uDDFA\uD83C\uDDF8 U.S. Central`,
            sydney: `\uD83C\uDDE6\uD83C\uDDFA Sydney`,
            useast: `\uD83C\uDDFA\uD83C\uDDF8 U.S. East`,
            ussouth: `\uD83C\uDDFA\uD83C\uDDF8 U.S. South`,
            uswest: `\uD83C\uDDFA\uD83C\uDDF8 U.S. West`,
            euwest: `\uD83C\uDDEA\uD83C\uDDFA Western Europe`,
            vipuseast: `\uD83C\uDDFA\uD83C\uDDF8 VIP U.S. East`,
            london: `\uD83C\uDDEC\uD83C\uDDE7 London`,
            amsterdam: `\uD83C\uDDF3\uD83C\uDDF1 Amsterdam`,
            hongkong: `\uD83C\uDDF3\uD83C\uDDF1 Hong Kong`,
            russia: `\uD83C\uDDF7\uD83C\uDDFA Russia`,
            southafrica: `\uD83C\uDDFF\uD83C\uDDE6 South Africa`
        },
        [],
        [],
        []
    ]
    console.log(online.length)
    console.log(online.filter(member => member.user.bot).length)
    guild.blacklist.length > 0 ? guild.blacklist.forEach(id => blacklist.push(client.channels.cache.get(id) ? client.channels.cache.get(id).toString() : `#${id}`)) : `no channels`
    guild.chatlist.length > 0 ? guild.chatlist.forEach(id => chatlist.push(client.channels.cache.get(id) ? client.channels.cache.get(id).toString() : `#${id}`)) : `not set`
    field.push(`\u279c Owner: \`${message.guild.owner.user.tag} [${message.guild.ownerID}]\``)
    field.push(`\u279c Region: \`${region[message.guild.region.replace(/-/g, ``)]}\``)
    field.push(`\u279c Verification lvl: \`${message.guild.verificationLevel}\``)
    field.push(`\u279c Explicit Filter: \`${message.guild.explicitContentFilter}\``)
    field.push(`\u279c Boost Tier: Tier \`${message.guild.premiumTier || 0} [${message.guild.premiumSubscriptionCount || 0} boosts]\``)
    field.push(`\u279c Member counts: \`${message.guild.members.cache.size.toLocaleString()} members [${message.guild.members.cache.filter(member => member.user.bot).size.toLocaleString()} Bots | ${message.guild.members.cache.filter(member => !member.user.bot).size.toLocaleString()} Users]\``)
    field.push(`\u279c Server stats: \`${message.guild.roles.cache.size.toLocaleString()} Roles and ${message.guild.channels.cache.size.toLocaleString()} Channels [${message.guild.channels.cache.filter(channel => channel.type === `text`).size.toLocaleString()} Text | ${message.guild.channels.cache.filter(channel => channel.type === `voice`).size.toLocaleString()} Voice]\``)
    field.push(`\u279c Emoji stats: \`${message.guild.emojis.cache.size.toLocaleString()} Emojis [${message.guild.emojis.cache.filter(emoji => !emoji.animated).size.toLocaleString()} Normal | ${message.guild.emojis.cache.filter(emoji => emoji.animated).size.toLocaleString()} Animated]\``)
    field.push(`\u279c Member stats: \`${String.fromCodePoint(128994)} ${online.length.toLocaleString()} | ${String.fromCodePoint(128993)} ${idle.length.toLocaleString()} | ${String.fromCodePoint(128308)} ${dnd.length.toLocaleString()} | ${String.fromCodePoint(128995)} ${streaming.length.toLocaleString()} | ${String.fromCodePoint(9898)} ${offline.length.toLocaleString()}\``)
    field.push(`\u279c User stats: \`${String.fromCodePoint(128994)} ${online.filter(member => !member.user.bot).length.toLocaleString()} | ${String.fromCodePoint(128993)} ${idle.filter(member => !member.user.bot).length.toLocaleString()} | ${String.fromCodePoint(128308)} ${dnd.filter(member => !member.user.bot).length.toLocaleString()} | ${String.fromCodePoint(128995)} ${streaming.filter(member => !member.user.bot).length.toLocaleString()} | ${String.fromCodePoint(9898)} ${offline.filter(member => !member.user.bot).length.toLocaleString()}\``)
    field.push(`\u279c Bot stats: \`${String.fromCodePoint(128994)} ${online.filter(member => member.user.bot).length.toLocaleString()} | ${String.fromCodePoint(128993)} ${idle.filter(member => member.user.bot).length.toLocaleString()} | ${String.fromCodePoint(128308)} ${dnd.filter(member => member.user.bot).length.toLocaleString()} | ${String.fromCodePoint(128995)} ${streaming.filter(member => member.user.bot).length.toLocaleString()} | ${String.fromCodePoint(9898)} ${offline.filter(member => member.user.bot).length.toLocaleString()}\``)
    field.push(`\u279c Server created: \`${moment.duration(new Date().getTime() - new Date(message.guild.createdAt).getTime()).format(`w [Weeks], d [Days], h [Hours], m [Minutes] ago`)}\``)
    field.push(`\u279c Stored Data: \`[(${guild.prefix}) Prefix | Nitro ${guild.nitro ? `Enabled` : `Disabled`} | '${guild.translate}' Default lang | ${guild.cmds.toLocaleString()} Commands used${user ? ` | Premium by: ${user.toString()}` : ``}]\``)
    field.push(`\u279c Badges: ${guild.badges.join(`, `)}`)
    field.push(`\u279c ${message.guild.members.cache.get(client.user.id).displayName} is restricted to ${blacklist.length > 0 ? blacklist.join(`, `) : `no channels`} and the default chatbot channels are ${chatlist.length > 0 ? chatlist.join(`, `) : `not set`}`)
    let embed = client.embed()
        .setAuthor(`${message.guild.name}[${message.guild.id}]`)
        .setDescription(field.join(`\n`))
        .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true, size: 2048 }))
    return message.channel.send(embed)
}

module.exports.code = {
    title: "server",
    about: "Information about the server",
    usage: ["%P%server"],
}

/*
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

const filterLevels = {
    DISABLED: 'Off',
    MEMBERS_WITHOUT_ROLES: 'No Role',
    ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
    NONE: 'None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: '(╯°□°）╯︵ ┻━┻',
    VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const regions = {
    brazil: 'Brazil',
    europe: 'Europe',
    hongkong: 'Hong Kong',
    india: 'India',
    japan: 'Japan',
    russia: 'Russia',
    singapore: 'Singapore',
    southafrica: 'South Africa',
    sydeny: 'Sydeny',
    'us-central': 'US Central',
    'us-east': 'US East',
    'us-west': 'US West',
    'us-south': 'US South'
};

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['server', 'guild', 'guildinfo'],
            description: 'Displays information about the server that said message was run in.',
            category: 'Information'
        });
    }

    async run(message) {
        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const members = message.guild.members.cache;
        const channels = message.guild.channels.cache;
        const emojis = message.guild.emojis.cache;

        const embed = new MessageEmbed()
            .setDescription(`**Guild information for __${message.guild.name}__**`)
            .setColor('BLUE')
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField('General', [
                `**❯ Name:** ${message.guild.name}`,
                `**❯ ID:** ${message.guild.id}`,
                `**❯ Owner:** ${message.guild.owner.user.tag} (${message.guild.ownerID})`,
                `**❯ Region:** ${regions[message.guild.region]}`,
                `**❯ Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
                `**❯ Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}`,
                `**❯ Verification Level:** ${verificationLevels[message.guild.verificationLevel]}`,
                `**❯ Time Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`,
                '\u200b'
            ])
            .addField('Statistics', [
                `**❯ Role Count:** ${roles.length}`,
                `**❯ Emoji Count:** ${message.guild.emojis.cache.size}`,
                `**❯ Regular Emoji Count:** ${message.guild.emojis.cache.filter(emoji => !emoji.animated).size}`,
                `**❯ Animated Emoji Count:** ${message.guild.emojis.cache.filter(emoji => emoji.animated).size}`,
                `**❯ Member Count:** ${message.guild.memberCount}`,
                `**❯ Humans:** ${members.filter(member => !member.user.bot).size}`,
                `**❯ Bots:** ${members.filter(member => member.user.bot).size}`,
                `**❯ Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`,
                `**❯ Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
                `**❯ Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
                '\u200b'
            ])
            .addField('Presence', [
                `**❯ Online:** ${members.filter(member => member.presence.status === 'online').size}`,
                `**❯ Idle:** ${members.filter(member => member.presence.status === 'idle').size}`,
                `**❯ Do Not Disturb:** ${members.filter(member => member.presence.status === 'dnd').size}`,
                `**❯ Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
                '\u200b'
            ])
            .addField(`Roles [${roles.length - 1}]`, roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles) : 'None')
            .setTimestamp();
        message.channel.send(embed);
    }

};
*/