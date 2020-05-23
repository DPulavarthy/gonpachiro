const moment = require("moment");
const momentDurationFormatSetup = require("moment-duration-format");
 
momentDurationFormatSetup(moment);

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let user;
    if (!args.join(" ")) {
        user = message.author;
    } else {
        if (args.join(" ") === `owner`) {
            user = message.guild.owner.user;
        } else {
            user = message.mentions.users.first() || await client.send.getUser(args.join(" "));
        }
        if (!user) return message.channel.send(`I was unable to get the user's information.`);
    }

    let type = user.presence.status;
    if (type === `online`) {
        type = client.emojis.cache.get(client.util.emoji.green).toString();
    } else if (type === `idle`) {
        type = client.emojis.cache.get(client.util.emoji.yellow).toString();
    } else if (type === `dnd`) {
        type = client.emojis.cache.get(client.util.emoji.red).toString();
    } else if (type === `streaming`) {
        type = client.emojis.cache.get(client.util.emoji.purple).toString();
    } else if (type === `offline`) {
        type = client.emojis.cache.get(client.util.emoji.grey).toString();
    }

    let name = ``,
        place = ``,
        description;
    user.presence.activities.forEach(activitiy => {
        if (activitiy.type === `CUSTOM_STATUS`) {
            description = activitiy.state;
        } else {
            `${client.arrow} Server created:\n`;
            let time = ` ${moment.duration(new Date().getTime() - new Date(activitiy.timestamps.start).getTime()).format("h [hrs], m [min]")}`
            name += `${client.arrow} [${activitiy.type.substring(0, 1)}${activitiy.type.substring(1).toLowerCase()} ${activitiy.name}](${activitiy.url}) for ${time || `N/A`}\n`;
        }
    })
    if (!user.bot && user.presence.status !== `offline`) {
        if (user.presence.clientStatus.web) {
            place += `${client.arrow}Website\n`
        }
        if (user.presence.clientStatus.desktop) {
            place += `${client.arrow}Desktop\n`
        }
        if (user.presence.clientStatus.mobile) {
            place += `${client.arrow}Mobile\n`
        }
    } else if (user.bot) {
        place = `${client.arrow}Bot\n`;
    } else {
        place = `${client.arrow}Not Active\n`;
    }
    const embed = client.send.embed()
        .setTitle(`${type} ${user.tag}`)
        .addField(`Activities`, name || `Not active`, false)
        .addField(`Active on`, place || `Not active`, false)
    if (description) {
        embed.setDescription(description);
    }
    await message.channel.send(embed);
    return client.send.log(message);
}

module.exports.code = {
    name: "presence",
    description: "Get the Discord Rich Presence info of [USER] / Author",
    group: "information",
    usage: ["/PREFIX/presence [USER]", "/PREFIX/presence"],
    accessableby: "Villagers",
    aliases: ["presence", "rp", "richpresence"]
}