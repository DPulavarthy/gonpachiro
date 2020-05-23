module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const embed = client.send.embed();
    let input = args.join(" ").toLowerCase();
    if (input) {
        if (input.startsWith(`//`)) {
            input = input.substring(2);
        }
        let command = client.commands.get(client.aliases.get(input)) || client.commands.get(input);
        if (command) {
            command = command.code;
            let aliases = ``;
            if (command.name !== `neko`) {
                command.aliases.forEach(alias => {
                    aliases += `${client.config.prefix}${client.send.clean(alias)}\n`;
                })
            } else {
                aliases = `${client.config.prefix}sfw\n${client.config.prefix}nsfw`
            }
            var usage = ``;
            command.usage.forEach(use => {
                usage += `${client.send.clean(use)}\n`;
            })
            try {
                embed
                    .setTitle(`Command: ${command.name.substring(0, 1).toUpperCase()}${command.name.substring(1)}`)
                    .setThumbnail(client.util.link.pfp)
                    .setDescription(`\`${client.config.prefix}key\` for more information about \`<>\` \`[]\` \`()\``)
                if (usage) {
                    embed.addField(`Usage`, usage, false)
                }
                if (aliases) {
                    embed.addField(`Aliases`, aliases, false)
                }
                if (command.description) {
                    embed.addField(`Description`, client.send.clean(command.description), false)
                }
                if (command.accessableby) {
                    embed.addField(`Accessable By`, client.send.clean(command.accessableby), false)
                }
                message.channel.send(embed);
                return client.send.log(message);
            } catch (error) {
                client.send.report(message, error)
                return client.send.log(mesage);
            }
        } else {
            var contact = client.send.get(`contact`);
            embed
                .setTitle(`***Something went wrong!***`)
                .setThumbnail(client.util.link.pfp)
                .setDescription(message.guild.members.cache.get(message.author.id).displayName + `, That command does not exist.\nTo see a list of commands, type: \`//commands\` or \`//help\``)
                .addField(contact[0], contact[1], contact[2])
            message.channel.send(embed);
            return client.send.log(message);
        }
    } else {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    }
}

module.exports.code = {
    name: "explain",
    description: "Gives a better description of a command's usage",
    group: "helpers",
    usage: ["/PREFIX/explain [COMMAND]"],
    accessableby: "Members",
    aliases: ["explain", "e"]
}