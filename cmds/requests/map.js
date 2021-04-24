module.exports.run = async (client, message, args, prefix) => {
    if (!args || args.length < 2) { return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    else { message.channel.send(args[Math.floor(Math.random() * args.length)]); return client.log(message); }
}

module.exports.code = {
    title: "map",
    about: "Returns 1 arg from [INPUT].\n[INPUT] = a list of items larger than 1",
    usage: ["%P%map [INPUT]"],
    dm: true,
}