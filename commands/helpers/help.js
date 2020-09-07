module.exports.run = async (client, message, args, prefix) => {
    let groups = [], field = [];
    client.commands.forEach(command => { if (!groups.includes(command.group)) { groups.push(command.group); }; });
    if (!args.join(` `)) {
        groups.forEach(group => { field.push(`${client.arrow} ${prefix}${module.exports.code.title} ${group}`) });
        message.channel.send(client.embed().setAuthor(`${client.user.username}'s Help list`, client.user.avatarURL({ format: "png", dynamic: true, size: 2048 }), client.util.link.support).setDescription(`${field.join(`\n`)}\n${client.arrow} ${prefix}${module.exports.code.title} full`));
        return client.log(message);
    } else {
        switch (args.join(` `).toUpperCase().includes(`FULL`)) {
            case true:
                message.channel.send(client.embed().setAuthor(`${client.user.username}'s Full Help list`, client.user.avatarURL({ format: "png", dynamic: true, size: 2048 }), client.util.link.support).setDescription(`${client.user.username}'s full help list can be viewd here: ${client.util.link.commands}.`));
                client.log(message);
                break;
            default:
                let category, body = [];
                for await (let group of groups) { if (group.toUpperCase().includes(args.join(` `).toUpperCase())) { category = group; }; };
                if (category) {
                    client.commands.forEach(command => { if (command.group === category) { body.push(`${client.arrow} ${client.src.clean(command.code.usage[0], prefix)}`); }; });
                    message.channel.send(client.embed().setAuthor(`Commands in Group ${category.substring(0, 1).toUpperCase()}${category.substring(1)}`, client.user.avatarURL({ format: "png", dynamic: true, size: 2048 }), client.util.link.support).setDescription(`**\`Use "${prefix}explain [COMMAND]" for more details\`**\n${body.join(`\n`)}`));
                    return client.log(message);
                } else {
                    message.channel.send(client.embed().setAuthor(`Invalid Group`, client.user.avatarURL({ format: "png", dynamic: true, size: 2048 }), client.util.link.support).setDescription(`That command group was not found, use the \`${prefix}${module.exports.code.title}\` command to see the groups.`));
                    return client.log(message);
                }
        }
    }
}

module.exports.code = {
    title: "help",
    about: "A list of commands",
    usage: ["%P%help"],
    alias: ["aid", "commands"]
}