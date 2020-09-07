module.exports.run = async (client, message, args, prefix) => {
    message.channel.startTyping(true);
    let alexa = require(`alexa-bot-api`);
    let ai = new alexa(client.key.alexa);
    if (!args.join(` `)) { message.channel.stopTyping(true); return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    ai.getReply(args.join(` `)).then(reply => { message.channel.send(reply); return client.log(message); });
    message.channel.stopTyping(true);
}

module.exports.code = {
    title: "chat",
    about: "%B% as a chatbot",
    usage: ["%P%chat [TEXT]"],
    alias: ["j"],
    dm: true,
}