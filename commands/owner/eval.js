module.exports.run = async (client, message, args, prefix) => {
    let loading = await message.channel.send(client.src.loading()), code = args.join(` `);
    if (!args.join(` `)) { loading.delete(); return client.src.require(message, module.exports.code.usage[0], module.exports.code.about); };
    for (let word of [`api`, `env`, `key`, `token`]) { if (args.join(` `).includes(`.${word}`)) { return result(`ERROR: You do not want to do this!\nA word has triggered the eval command to terminate!`, false, `xl`); }; };
    try { let evaled = clean(await eval(code)); if (evaled.length > (1900 - args.join(` `).length)) { evaled = `${evaled.substring(0, (1900 - args.join(` `).length))}...`; }; return result(evaled, true); } catch (error) { client.src.error(error); return result(error); };
    function result(output, status, format) { setTimeout(function () { loading.edit(client.embed().setDescription(`**${client.emojis.cache.get(client.emoji.input)} Input**\n${client.src.code(args.join(` `))}\n**${client.emojis.cache.get(client.emoji.output)} Output**\n${client.src.code(output, format || `js`)}`).addField(`Status`, status ? `${client.emojis.cache.get(client.emoji.green).toString()} - Success` : `${client.emojis.cache.get(client.emoji.red).toString()} - Failed`)); }, 1000); return client.log(message, `hiro`); };
    function clean(text) { if (typeof text !== `string`) { text = require(`util`).inspect(text, { depth: 0 }); }; return text.replace(/`/g, `\`` + String.fromCharCode(8203)).replace(/@/g, `@` + String.fromCharCode(8203)).replace(new RegExp(process.env.TOKEN, "gi"), `[DENIED]`); };
}

module.exports.code = {
    title: "eval",
    about: "Evaluates [CODE]",
    usage: ["%P%eval [CODE]"],
    ranks: 8,
    dm: true,
}