const package = require(`../../package.json`);
const Discord = require(`discord.js`);

module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const embed = client.send.embed()
        .setTitle(`Debugging`)
        .addField(`Full Name`, code(client.user.tag), true)
        .addField(`ID`, code(client.user.id), true)
        .addField(`Processing memory`, code((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ` MB`), true)
        .addField(`Discord.JS Version`, code(`v` + Discord.version), true)
        .addField(`Node.JS Version`, code(process.version), true)
        .addField(`Client Version`, code(`v` + package.version), true)
        .addField(`Last Updated`, client.readyAt.toDateString(), true)
        .addField(`Maintainers and developers`, client.send.approve(`developer`).map(id => `\`${client.guilds.cache.get(client.util.id.guild).members.cache.get(id).displayName}\``).join(", "), true)
    await message.channel.send(embed);
    return client.send.log(message);

    function code(input) {
        return `\`\`\`\n${input}\n\`\`\``
    }
}

module.exports.code = {
    name: "debug",
    description: "Debugging/Processing Information",
    group: "devs",
    usage: ["/PREFIX/debug"],
    accessableby: "Villagers",
    aliases: ["debug"]
}