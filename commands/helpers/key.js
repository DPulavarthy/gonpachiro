module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let input = args.join().toUpperCase();
    var info = ``;
    var data = [
        `\`<>\` = Aliases, keywords that can also trigger the command`,
        `\`[]\` = Required input, without this input the command would not function as it should`,
        `\`()\` = Optional input, without this input the command would still function properly`,
        `\`TIN\` = Troubleshooting Identification Number (Devs and Gonpachiro users)`
    ];

    if (input) {
        if (input === `<>`) {
            info = data[0];
        } else if (input === `[]`) {
            info = data[1];
        } else if (input === `()`) {
            info = data[2];
        } else if (input === `TIN`) {
            info = data[3];
        } else {
            info = `No key found for \`${input}\``;
        }
    } else {
        if (!input) {
            for (var i = 0; i < data.length; i++) {
                info += `${data[i]}\n`;
            }
        }
    }
    const embed = client.send.embed()
        .setAuthor(`${client.user.username}'s Keys`, client.util.link.logo, client.util.link.support)
        .setDescription(info)
        .setThumbnail(client.util.link.pfp)
    await message.channel.send(embed);
    return client.send.log(message);
}

module.exports.code = {
    name: "key",
    description: "Information on some of the formatting for /BOT/'s commands",
    group: "helpers",
    usage: ["/PREFIX/key (TYPE)"],
    accessableby: "Villagers",
    aliases: ["keys", "key", "legend"]
}