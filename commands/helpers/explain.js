module.exports.run = async (client, message, args, prefix) => {
    let input = args.join(` `);
    if (input) {
        input = input.toLowerCase();
        if (input.startsWith(client.prefix) || input.startsWith(prefix)) { input = input.substring(2); };
        let command = client.commands.get(client.aliases.get(input)) || client.commands.get(input) || client.commands.get(client.aliases.get(`?${input}`)) || client.commands.get(`/${input}`);
        if (command) {
            let field = [], tags = [];
            if (command.code.dm) { tags.push(`DM`); };
            if (command.code.nsfw) { tags.push(`NSFW`); };
            field.push(`${client.arrow} Group: ${command.group.substring(0, 1).toUpperCase()}${command.group.substring(1)}`);
            field.push(`${client.arrow} Ranks: [${command.code.ranks || 0}] ${command.code.ranks && command.code.ranks > 0 ? `You must be a ${client.ranks.get(command.code.ranks)}` : `Everyone has access (${client.ranks.get(0)})`}`);
            field.push(`${client.arrow} Description: ${client.src.clean(command.code.about)}`);
            field.push(`${client.arrow} Tags: ${tags.length > 0 ? tags.join(`, `) : `N/A`}`);
            field.push(`${client.arrow} Cooldown: ${command.code.cooldown || 3} seconds`);
            field.push(`${client.arrow} Aliases: ${command.code.alias ? `<${prefix}${command.code.alias.join(` <${prefix}`)}>` : `N/A`}`);
            field.push(`${client.arrow} Usage${command.code.usage ? `\n${client.blank}${client.src.clean(command.code.usage.join(`\n${client.blank}`))}` : `: N/A`}`);
            const embed = client.embed()
                .setTitle(`Command: ${command.code.title.substring(0, 1).toUpperCase()}${command.code.title.substring(1)}`)
                .setThumbnail(client.user.avatarURL({ format: "png", dynamic: true, size: 2048 }))
                .setDescription(`\`${prefix}key\` for more information about \`<>\` \`[]\` \`()\`\n\n${field.join(`\n`)}`)
            message.channel.send(embed);
            return client.log(message);
        } else { message.channel.send(client.embed().setTitle(`***Invalid Input***`).setColor(client.util.id.failed).setDescription(`${message.guild.members.cache.get(message.author.id).displayName}, That command does not exist.\nTo see a list of commands visit: ${client.util.link.commands}`)); return client.log(message); };
    } else { client.src.input(message, module.exports.code.usage[0], module.exports.code.description); return client.log(message); };
}

module.exports.code = {
    title: "explain",
    about: "Gives a better description of a command's usage",
    usage: ["%P%explain [COMMAND]"],
    alias: ["e"]
}