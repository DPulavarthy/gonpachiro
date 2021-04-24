module.exports.run = async (client, message, args) => {
    let normalize = Math.round((parseInt(args.join(" ")) / 1.2));
    message.channel.send((!normalize || isNaN(normalize)) ? client.src.comment(`Input cannot be modified, make sure it is a number, output: ${normalize}`) : normalize);
    return client.log(message);
}

module.exports.code = {
    title: "normalize",
    about: "Normalizes number for MA, made for server [Heaven's Void](https://discord.gg/bVBRkF4)",
    usage: ["%P%normalize [NUMER]"],
    alias: ["n"],
    dm: true,
}