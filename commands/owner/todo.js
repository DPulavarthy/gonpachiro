module.exports.run = async (client, message, args) => {
    client.database.data.findOne({ case: module.exports.code.title }, function (error, result) {
        if (!result) { return client.src.db(message, module.exports.code.title); }
        if (error) { client.error(error); };
        let input = args.join(` `), field = [];
        if (input.startsWith(`+`)) { result.data.push(input.substring(1)); write(result.data); }
        else if (input.startsWith(`-`)) { result.data.splice(parseInt(input.substring(1)) - 1, 1); write(result.data); }
        else if (input === `--`) { result.data.shift(); write(result.data); }
        else if (input.toUpperCase() === `CLEAR`) { result.data = []; write(result.data); }
        else {
            if (result.data.length < 1) {
                message.channel.send(client.src.comment(`There are no items on the To-Do List`));
                return client.log(message);
            }
            for (let i = 0; i < result.data.length; i++) { if (i < 10) { field.push(`\`${i + 1}.)\` ${result.data[i]}`); }; };
            if (result.data.length > 10) { field.push(`...and ${result.data.length - 10} more items.`); };
            message.channel.send(client.embed().setTitle(`${client.user.username}'s To-Do List`).setDescription(field.join(`\n`)));
        }
        return client.log(message);
    })

    function write(input) {
        result = { $set: { data: input } };
        client.database.data.updateOne({ case: module.exports.code.title }, result, function (error) {
            if (error) { client.error(error); }
            else { message.react(client.emojis.cache.get(client.emoji.check)); };
        });
    }
}

module.exports.code = {
    title: "todo",
    about: "Adds to the todo list",
    usage: ["%P%todo +[ITEM]", "%P%todo -[INDEX]"],
    ranks: 8,
    dm: true,
}