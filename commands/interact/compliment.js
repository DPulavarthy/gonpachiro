var nicejob = require('nicejob');

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    await message.reply(nicejob());
    return client.send.log(message);
}

module.exports.code = {
    name: "compliment",
    description: "A random compliment",
    group: "interact",
    usage: ["/PREFIX/compliment"],
    accessableby: "Villagers",
    aliases: ["compliment", "comp", "nice"]
}