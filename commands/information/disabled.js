module.exports.run = async (client, message, args, prefix) => {
    client.database.data.findOne({ case: module.exports.code.title }, async function (error, result) {
        if (error) { client.error(error); };
        if (!result) { result = await client.src.db(module.exports.code.title); };
        message.channel.send(client.embed().setTitle(`Disabled Commands`).setDescription(`The following commands have been disabled or they are getting fixed. The disabled command(s) might still be active but, they are currently being updated.\n${result.data.join(`\n`)}`));
        return client.log(message);
    })
}

module.exports.code = {
    title: "disabled",
    about: "A list of Disabled commands",
    usage: ["%P%disabled"],
    alias: ["down"],
    dm: true,
}