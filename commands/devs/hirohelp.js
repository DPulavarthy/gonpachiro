const { readdirSync } = require("fs");

module.exports.run = async (client, message, args, guilds, con) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!client.send.approve(message.author.id, `APPROVED`)) {
        client.send.restrict(message, 14);
        return client.send.log(message, `hiro`);
    } else {
        let i = 0,
            loc = 0;
        const embed = client.send.embed()
            .setTitle(`${client.emojis.cache.get(client.util.emoji.lock).toString()} Commands for Gonpachiro user`)
            .setThumbnail(client.util.link.pfp)
        readdirSync("./commands/").forEach(() => { i++; });
        readdirSync("./commands/").forEach(async dir => {
            const commands = readdirSync(`./commands/${dir}/`).filter(file => file.split(".").pop() === "js");

            for (let file of commands) {
                let pull = require(`../../commands/${dir}/${file}`);
                if (pull.code.name) {
                    if (pull.code.name.includes(`hiro`)) {
                        embed.addField(`Input: ${client.config.prefix}${pull.code.name}`, `Action: ${pull.code.description}`, false)
                    }
                }
                else {
                    continue;
                }
            }
            loc++;
            if (loc === i) {
                message.channel.send(embed);
                return client.send.log(message, `hiro`);
            }
        });
    }
}

module.exports.code = {
    name: "/hirohelp",
    description: "Help commands for Devs",
    group: "devs",
    usage: ["/PREFIX//hirohelp"],
    accessableby: "Owner",
    aliases: ["/hirohelp"]
}

