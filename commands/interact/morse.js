module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let alpha = " ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(""),
        morse = "/,•–,–•••,–•–•,–••,•,••–•,––•,••••,••,•–––,–•–,•–••,––,–•,–––,•––•,––•–,•–•,•••,–,••–,•••–,•––,–••–,–•––,––••,•––––,••–––,•••––,••••–,•••••,–••••,––•••,–––••,––––•,–––––".split(","),
        text = args.join(" ").toUpperCase();
    while (text.includes("Ä") || text.includes("Ö") || text.includes("Ü")) {
        text = text.replace("Ä", "AE").replace("Ö", "OE").replace("Ü", "UE");
    }
    if (text.startsWith("•") || text.startsWith("–")) {
        text = text.split(" ");
        let length = text.length;
        for (i = 0; i < length; i++) {
            text[i] = alpha[morse.indexOf(text[i])];
        }
        text = text.join("");
    } else {
        text = text.split("");
        let length = text.length;
        for (i = 0; i < length; i++) {
            text[i] = morse[alpha.indexOf(text[i])];
        }
        text = text.join(" ");
    }
        const embed = client.send.embed()
            .setAuthor(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL(), client.util.link.support)
            .setDescription(text)
        await message.channel.send(embed);
        return client.send.log(message);
}
module.exports.code = {
    name: "morse",
    description: "Converts [TEXT] to morse code",
    group: "interact",
    usage: ["/PREFIX/morse [TEXT]"],
    accessableby: "Villagers",
    aliases: ["morse", "m"]
}