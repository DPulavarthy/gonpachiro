module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!client.send.approve(message.author.id, `APPROVED`)) {
        client.send.restrict(message, 14);
        return client.send.log(message, `hiro`);
    } else {
        let uptime = ``,
            totalSeconds = (client.uptime / 1000),
            days = Math.floor(totalSeconds / 86400),
            hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600
        let minutes = Math.floor(totalSeconds / 60),
            seconds = totalSeconds % 60;
        if (days && days != `0`) {
            uptime += Math.floor(days) + ` day(s), `
        }
        if (hours && hours != `0`) {
            uptime += Math.floor(hours % 24) + ` hour(s), `
        }
        if (minutes && minutes != `0`) {
            uptime += Math.floor(minutes) + ` minute(s), `
        }
        if (seconds && seconds != `0`) {
            uptime += Math.floor(seconds) + ` second(s)`
        }
        message.channel.send(`\`\`\`\n --> LOGS START <-- [5 -> latest & 1 -> oldest] Uptime: ` + uptime + `\n` + client.send.getLog() + ` ---> LOGS END <--- \`\`\``);
        return client.send.log(message, `hiro`);
    }
}

module.exports.code = {
    name: "/hirolog",
    description: "Recent logs",
    group: "devs",
    usage: ["/PREFIX//hirogetlog"],
    accessableby: "Gonpachiro",
    aliases: ["/hirogetlog", "/hirogetlast", "/hirolog", "/hirologs"]
}