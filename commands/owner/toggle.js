module.exports.run = async (client, message, args, prefix) => {
    if (!args.join(` `) || !args[1]) { loading.delete(); return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    client.database.config.findOne({ case: module.exports.code.title }, async function (error, result) {
        if (error) { client.error(error); };
        let disable = false, input = args[0];
        if (args[1].toUpperCase() === `-OFF` || args[1].toUpperCase() === `-DOWN`) { disable = true; };
        let command = client.commands.get(client.aliases.get(input)) || client.commands.get(input) || client.commands.get(client.aliases.get(`/${input}`)) || client.commands.get(`/${input}`);
        if (command) {
            if (disable) {
                if (result.cmds.includes(command.code.title)) { message.channel.send(client.src.comment(`Command already disabled.`)); return client.log(message); };
                result.cmds.push(command.code.title);
                let res = { $set: { cmds: result.cmds } };
                client.database.config.updateOne({ case: module.exports.code.title }, res, function (error) { if (error) { client.error(error); } });
                message.react(client.emojis.cache.get(client.emoji.check));
                return client.log(message);
            }
            else {
                if (!result.cmds.includes(command.code.title)) { message.channel.send(client.src.comment(`Command not disabled.`)); return client.log(message); };
                result.cmds = result.cmds.filter(name => name !== command.code.title);
                let res = { $set: { cmds: result.cmds } };
                client.database.config.updateOne({ case: module.exports.code.title }, res, function (error) { if (error) { client.error(error); } });
                message.react(client.emojis.cache.get(client.emoji.check));
                return client.log(message);
            }
        } else {
            let groups = [];
            client.commands.forEach(command => { if (!groups.includes(command.group)) { groups.push(command.group); }; });
            if (groups.includes(args[0].toLowerCase())) {
                if (disable) {
                    if (result.groups.includes(args[0].toLowerCase())) { message.channel.send(client.src.comment(`Command Group already disabled.`)); return client.log(message); };
                    result.groups.push(args[0].toLowerCase());
                    let res = { $set: { groups: result.groups } };
                    client.database.config.updateOne({ case: module.exports.code.title }, res, function (error) { if (error) { client.error(error); } });
                    message.react(client.emojis.cache.get(client.emoji.check));
                    return client.log(message);
                }
                else {
                    if (!result.groups.includes(args[0].toLowerCase())) { message.channel.send(client.src.comment(`Command Group not disabled.`)); return client.log(message); };
                    result.groups = result.groups.filter(name => name !== args[0].toLowerCase());
                    let res = { $set: { groups: result.groups } };
                    client.database.config.updateOne({ case: module.exports.code.title }, res, function (error) { if (error) { client.error(error); } });
                    message.react(client.emojis.cache.get(client.emoji.check));
                    return client.log(message);
                }
            } else { message.channel.send(client.src.comment(`ERROR: That command file / group was found`)); return client.log(message); };
        }

    })
}

module.exports.code = {
    title: "toggle",
    about: "Globally enable or disable commands",
    usage: ["%P%toggle [COMMAND] [-ON OR -OFF]"],
    alias: ["global"],
    ranks: 7,
    dm: true,
}
