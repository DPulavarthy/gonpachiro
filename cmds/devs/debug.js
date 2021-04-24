module.exports.run = async (client, message, args, guild) => {
    require(`systeminformation`).cpu().then(cpu => {
        require(`systeminformation`).osInfo().then(os => {
            const embed = client.embed()
                .setAuthor(`Debugging`, null, client.util.link.support)
                .addField(`Client Tag`, client.src.code(client.user.tag), true)
                .addField(`Client ID`, client.src.code(client.user.id), true)
                .addField(`Processing memory`, client.src.code(formatBytes(process.memoryUsage().rss)), true)
                .addField(`Discord.JS Version`, client.src.code(`v${require(`discord.js`).version}`), true)
                .addField(`Node.JS Version`, client.src.code(process.version), true)
                .addField(`Client Version`, client.src.code(`v${require(`../../package.json`).version}`), true)
                .addField(`WS Ping`, client.src.code(`${client.ws.ping}ms`), true)
                .addField(`Server Info`, client.src.code(os.platform), true)
                .addField(`Cores`, client.src.code(cpu.cores), true)
                .addField(`Last Updated`, client.readyAt.toDateString(), true)
                .addField(`Maintainers and developers`, client.owners.map(id => `\`${client.users.cache.get(id).username}\``).join(`, `), true)
            setTimeout(async () => message.channel.send(embed), 1000)
        })
    })
}

function formatBytes(bytes) {
    if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(2)}GB`
    else if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(2)}MB`
    else if (bytes >= 1000) return `${(bytes / 1000).toFixed(2)}KB`
    else if (bytes > 1 || bytes < 1) return `${bytes} bytes`
    else return `${bytes} byte`
}

module.exports.code = {
    title: "debug",
    about: "Debugging/Processing Information",
    usage: ["%P%debug"]
}