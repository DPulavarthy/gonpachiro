module.exports.run = async (client, message) => {
    let loading = await message.channel.send(client.src.loading());
    // client.database.config.findOne({ case: `data` }, async function (error, result) {
    //     if (error) { client.error(error); };
    //     let developer = result.data.find(group => group.rank === 7);
        require(`systeminformation`).cpu().then(cpu => {
            require(`systeminformation`).osInfo().then(os => {
                const embed = client.embed()
                    .setTitle(`Debugging`)
                    .addField(`Full Name`, client.src.code(client.user.tag), true)
                    .addField(`ID`, client.src.code(client.user.id), true)
                    .addField(`Discord.JS Version`, client.src.code(`v${require(`discord.js`).version}`), true)
                    .addField(`Node.JS Version`, client.src.code(process.version), true)
                    .addField(`Processing memory`, client.src.code(formatBytes(process.memoryUsage().rss)), true)
                    .addField(`Client Version`, client.src.code(`v${require(`../../package.json`).version}`), true)
                    .addField(`Ping`, client.src.code(`${client.ws.ping}ms`), true)
                    .addField(`Server Info`, client.src.code(os.platform), true)
                    .addField(`Cores`, client.src.code(cpu.cores), true)
                    .addField(`Last Updated`, client.readyAt.toDateString(), true)
                    // .addField(`Maintainers and developers`, developer.data.map(id => `\`${client.users.cache.get(id).username}\``).join(", "), true)
                setTimeout(async () => { loading.edit(embed); }, 1000);
                return client.log(message);
            })
        })
    // })
}

function formatBytes(bytes) {
    if (bytes >= 1000000000) { bytes = (bytes / 1000000000).toFixed(2) + 'GB'; }
    else if (bytes >= 1000000) { bytes = (bytes / 1000000).toFixed(2) + 'MB'; }
    else if (bytes >= 1000) { bytes = (bytes / 1000).toFixed(2) + 'KB'; }
    else if (bytes > 1) { bytes = bytes + ' bytes'; }
    else if (bytes == 1) { bytes = bytes + ' byte'; }
    else { bytes = '0 byte'; }
    return bytes;
}

module.exports.code = {
    title: "debug",
    about: "Debugging/Processing Information",
    usage: ["%P%debug"],
    dm: true,
}