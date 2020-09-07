module.exports.run = async (client, message, args) => {
    if (!args.join(` `)) { return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); };
    let alpha = ` ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`.split(``), text = args.join(` `).toUpperCase(), morse = `/,•–,–•••,–•–•,–••,•,••–•,––•,••••,••,•–––,–•–,•–••,––,–•,–––,•––•,––•–,•–•,•••,–,••–,•••–,•––,–••–,–•––,––••,•––––,••–––,•••––,••••–,•••••,–••••,––•••,–––••,––––•,–––––`.split(`,`);
    while (text.includes(`Ä`) || text.includes(`Ö`) || text.includes(`Ü`)) { text = text.replace(`Ä`, `AE`).replace(`Ö`, `OE`).replace(`Ü`, `UE`); };
    if (text.startsWith(`•`) || text.startsWith(`–`)) { text = text.split(` `); let length = text.length; for (i = 0; i < length; i++) { text[i] = alpha[morse.indexOf(text[i])]; }; text = text.join(``); }
    else { text = text.split(``); let length = text.length; for (i = 0; i < length; i++) { text[i] = morse[alpha.indexOf(text[i])]; }; text = text.join(` `); };
    message.channel.send(client.embed().setAuthor(`Requested by: ${message.author.tag}`, message.author.avatarURL({ format: "png", dynamic: true, size: 2048 })).setDescription(text));
    return client.log(message);
}
module.exports.code = {
    title: "morse",
    about: "Converts [TEXT] to morse code",
    usage: ["%P%morse [TEXT]"],
    alias: ["morse", "m"],
    dm: true,
}