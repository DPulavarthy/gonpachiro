module.exports.run = async (client, message, args) => {
    let reverse = Math.round((parseInt(args.join(" ")) * 1.2));
    message.channel.send((!reverse || isNaN(reverse)) ? client.src.comment(`Input cannot be modified, make sure it is a number, output: ${reverse}`) : reverse);
    return client.log(message);
}

module.exports.code = {
    title: "reverse",
    about: "Reverses number for MA, made for server [Heaven's Void](https://discord.gg/bVBRkF4)",
    usage: ["%P%reverse [NUMER]"],
    alias: ["r"],
    dm: true,
}