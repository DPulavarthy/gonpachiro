module.exports.run = async (client, message, args) => {
    client.database.data.findOne({ case: module.exports.code.title }, function (error, result) {
        if (error) { client.error(error); };
        if (!result) { return client.src.db(message, module.exports.code.title); }
        if (!args.join(` `)) { return info(); }
        let user = message.mentions.users.first() ? client.users.cache.get(message.mentions.users.first().id) : false || client.users.cache.get(args.join(" ").substring(1)) ? client.users.cache.get(args.join(" ").substring(1)) : false;
        if (!user) { message.channel.send(client.src.comment(`That user was not found.`)); return client.src.log(message, `hiro`); };
        let input = args.join(` `);
        if (input.startsWith(`+`)) {
            if (!result.data.includes(user.id)) {
                result.data.push(user.id);
                let res = { $set: { data: result.data } };
                client.database.data.updateOne({ case: module.exports.code.title }, res, function (error) { if (error) { client.src.error(error); } });
                message.react(client.emojis.cache.get(client.emoji.check));
                return client.log(message);
            } else { message.channel.send(client.src.comment(`User with ID (${user.id}) is already blacklisted.`)); return client.log(message); };
        }
        else if (input.startsWith(`-`)) {
            if (result.data.includes(user.id)) {
                result.data = result.data.filter(mem => mem !== user.id);
                let res = { $set: { data: result.data } };
                client.database.data.updateOne({ case: module.exports.code.title }, res, function (error) { if (error) { client.src.error(error); } });
                message.react(client.emojis.cache.get(client.emoji.check));
                return client.log(message);
            } else { message.channel.send(client.src.comment(`User with ID (${user.id}) is not blacklisted.`)); return client.log(message); }
        }
        else { return info(); }
    })
    function info() {
        client.database.data.findOne({ case: module.exports.code.title }, async function (error, result) {
            if (error) { client.error(error); };
            let server = message.guild.members.cache.filter(user => result.data.includes(user.id)).size;
            message.channel.send(client.src.comment(`There ${result.data.length === 1 ? `is 1 user` : `are ${result.data.length} users`} that are blacklisted on ${client.user.username} and ${server === 1 ? `1 user is` : `${server || 0} users are`} currently in this server that are blacklisted.`));
        })
        return client.log(message);
    }
}

module.exports.code = {
    title: "blacklist",
    about: "Adds/removes user to blacklist",
    usage: ["%P%bl +[USER]", "%P%bl -[USER]"],
    alias: ["bl"],
    ranks: 8,
    dm: true,
}