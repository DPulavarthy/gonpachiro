const { readdirSync } = require("fs");

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let groups = [],
        field = ``,
        i = 0;

    readdirSync(`./commands/`).forEach(dir => {
        groups.push(dir)
    })

    if (!args.join(" ")) {
        groups.forEach(group => {
            field += `${client.arrow} ${client.config.prefix}${module.exports.code.name} ${group}\n`;
        })
        const embed = client.send.embed()
            .setAuthor(`${client.user.username}'s Help list`, client.util.link.logo, client.util.link.support)
            .setDescription(field)
        await message.channel.send(embed);
        return client.send.log(message);
    } else {
        let directory;
        readdirSync(`./commands/`).forEach(async dir => {
            if (dir.includes(args.join(" ").toLowerCase())) {
                directory = `./commands/${dir}`;
            }
            i++;
            if (i === groups.length) {
                if (!directory) {
                    await message.channel.send(`That group was not found, use \`${client.config.prefix}${module.exports.code.name}\` to get the list of groups`);
                    return client.send.log(message);
                } else {
                    let loc = directory.lastIndexOf(`/`) + 1;
                    const embed = client.send.embed()
                    .setAuthor(`Commands in ${directory.substring(loc, loc + 1).toUpperCase()}${directory.substring(loc + 1)}`, client.util.link.logo, client.util.link.support)
                    let body = `**\`Use \"${client.config.prefix}explain [COMMAND]\" for more details\`**\n`;
                    readdirSync(directory).forEach(async file => {
                        if (file.startsWith(`hiro`)) {
                            file = `/${file}`
                        }
                        file = file.substring(0, file.length - 3)
                        let loc = directory.lastIndexOf(`/`);
                        directory = directory.substring(loc + 1, loc + 2).toUpperCase() + directory.substring(loc + 2);
                        try {
                            let command = client.commands.get(file).code || client.commands.get(client.aliases.get(file)).code ;
                            command.usage.forEach(use => {
                                body += `${client.arrow} ${client.send.clean(use)}\n`;
                            })
                        } catch (error) {
                            client.send.report(message, error);
                            return client.send.log(message);
                        }
                    })
                    message.channel.send(embed.setDescription(body));
                    return client.send.log(message);
                }
            }
        })
    }
}

module.exports.code = {
    name: "help",
    description: "A list of commands",
    group: "helpers",
    usage: ["/PREFIX/help"],
    accessableby: "Villagers",
    aliases: ["help", "h", "aid", "commands", "cmds", "cmd"]
}