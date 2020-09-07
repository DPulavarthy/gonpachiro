const moment = require(`moment`);
require(`moment-duration-format`)(moment);

module.exports.run = async (client, message, args) => {
    let status, user = await client.src.userlist(message, args);
    if (user.length < 1) { message.channel.send(client.src.comment(`That user was not found in ${message.guild.name}`)); return client.log(message); };
    user = await client.users.cache.get(user[0].id);
    switch (user.presence.status.toUpperCase()) { case `ONLINE`: status = client.emoji.green; break; case `IDLE`: status = client.emoji.yellow; break; case `DND`: status = client.emoji.red; break; case `STREAMING`: status = client.emoji.purple; break; default: status = client.emoji.grey; };
    let name = ``, place = ``, description;
    user.presence.activities.forEach(activitiy => {
        if (activitiy.type === `CUSTOM_STATUS`) { description = activitiy.state; }
        else {
            let time = ``;
            if (activitiy.timestamps) { time = moment.duration(new Date().getTime() - new Date(activitiy.timestamps.start).getTime()).format(`h [hrs], m [min]`); };
            name += `${client.arrow} [${activitiy.type.substring(0, 1)}${activitiy.type.substring(1).toLowerCase()} ${activitiy.name}](${activitiy.url})${time !== `` ? ` for ${time}` : ``}\n`;
        }
    })
    if (!user.bot && user.presence.status !== `offline`) {
        if (user.presence.clientStatus.web) { place += `${client.arrow}Website\n` };
        if (user.presence.clientStatus.desktop) { place += `${client.arrow}Desktop\n` };
        if (user.presence.clientStatus.mobile) { place += `${client.arrow}Mobile\n` };
    } else if (user.bot) { place = `${client.arrow}Bot\n`; } else { place = `Not Active\n`; }
    const embed = client.embed()
        .setTitle(`${client.emojis.cache.get(status).toString()} ${user.tag}`)
        .addField(`Activities`, name || `Not active`, false)
        .addField(`Active on`, place || `Not active`, false)
    if (description) { embed.setDescription(description); };
    message.channel.send(embed);
    return client.log(message);
}

module.exports.code = {
    title: "presence",
    about: "Get the Discord Rich Presence info of (USER)",
    usage: ["%P%presence [USER]"],
    alias: ["rp"]
}