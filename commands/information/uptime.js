module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let uptime = ``,
        totalSeconds = (client.uptime / 1000),
        days = Math.floor(totalSeconds / 86400),
        hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600
    let minutes = Math.floor(totalSeconds / 60),
        seconds = totalSeconds % 60;
    if (days && days !== `0`) {
        uptime += Math.floor(days) + ` day(s), `
    }
    if (hours && hours !== `0` && (hours % 24) !== `0`) {
        uptime += Math.floor(hours % 24) + ` hour(s), `
    }
    if (minutes && minutes !== `0`) {
        uptime += Math.floor(minutes) + ` minute(s), `
    }
    if (seconds && seconds !== `0`) {
        uptime += Math.floor(seconds) + ` second(s)`
    }
    message.channel.send(client.send.embed().setTitle(uptime))
    return client.send.log(message);

}

module.exports.code = {
    name: "uptime",
    description: "Uptime of /BOT/",
    group: "information",
    usage: ["/PREFIX/uptime"],
    accessableby: "Villagers",
    aliases: ["uptime", "up"]
}