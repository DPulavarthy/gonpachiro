const compare = require(`string-similarity-js`);

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let text1 = args[0],
        text2 = args.slice(1).join(' ');

    if ((!text1 && !text2) || !text1) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    } else if (text1 && !text2) {
        text2 = message.guild.members.cache.get(message.author.id).displayName;
    }
    if (text1.startsWith('<@&') && text1.endsWith('>')) {
        if (message.guild.roles.cache.get(text1.slice(3, -1))) {
            text1 = message.guild.roles.cache.get(text1.slice(3, -1)).name;
        }
    } else if (text1.startsWith('<@!') && text1.endsWith('>')) {
        if (message.guild.members.cache.get(text1.slice(3, -1))) {
            text1 = message.guild.members.cache.get(text1.slice(3, -1)).displayName;
        }
    } else if (text1.startsWith('<@') && text1.endsWith('>')) {
        if (message.guild.members.cache.get(text1.slice(2, -1))) {
            text1 = message.guild.members.cache.get(text1.slice(2, -1)).displayName;
        }
    }

    if (text2.startsWith('<@!') && text2.endsWith('>')) {
        if (message.guild.members.cache.get(text2.slice(3, -1))) {
            text2 = message.guild.members.cache.get(text2.slice(3, -1)).name;
        }
    } else if (text2.startsWith('<@&') && text2.endsWith('>')) {
        if (message.guild.roles.cache.get(text2.slice(3, -1))) {
            text1 = message.guild.roles.cache.get(text2.slice(3, -1)).displayName;
        }
    } else if (text2.startsWith('<@') && text2.endsWith('>')) {
        if (message.guild.members.cache.get(text2.slice(2, -1))) {
            text2 = message.guild.members.cache.get(text2.slice(2, -1)).displayName;
        }
    }


    let percent,
        div;
    if (text1.length > text2.length) {
        percent = text2.length;
        div = text1.length;
    } else {
        percent = text1.length;
        div = text2.length;
    }

    let ship = compare.stringSimilarity(text1, text2, percent);

    ship = (((ship + percent) * text1.length) / percent) + div;

    if (ship % 2 === 0) {
        ship = 50 + ship;
    } else if (ship % 3 === 0) {
        ship = 50 - ship;
    }

    if (ship > 100) {
        ship = 100 - (ship % 100);
    }

    if (text1.length < text2.length) {
        ship = 100 - ship;
    }

    let part1 = Math.floor(ship - Math.floor(Math.random() * ship) + 1),
        part2 = Math.floor(ship - part1),
        fill = Math.floor((ship + 5) / 10),
        msg = Math.floor(ship / 10),
        shipmeter = ``;
    if (text1 === text2) {
        msg = 10;
        part1 = 50;
        part2 = 50;
        ship = 100;
        for (let i = 0; i < msg; i++) {
            shipmeter += client.emojis.cache.get(client.util.emoji.bar_filled).toString();
        }
    } else {
        for (let i = 0; i < 10; i++) {
            if (i < fill) {
                shipmeter += client.emojis.cache.get(client.util.emoji.bar_filled).toString();
            } else {
                shipmeter += client.emojis.cache.get(client.util.emoji.bar_empty).toString();
            }
        }
    }
    const comment = [`Not compatible?!`, `This is unsettling...`, `Maybe rethink this`, `This isn't good enough`, `Is this destiny?`, ` Could be better!`, `So close peeps so close...`, `Well I support you the whole way`, `Good Match!!`, `These calcuations are past my ability! Perfect Match!`, `Wimp, shipping yourself`];
    const embed = client.send.embed()
        .setTitle(`Shipping ${text1} and ${text2}`)
        .setDescription(`**${text1}** contributes \`${part1}%\`\n**${text2}** contributes \`${part2}%\``)
        .addField(`Ship-meter`, `${shipmeter} ${ship}%\n${comment[msg]}`, false)
    await message.channel.send(embed);
    return client.send.log(message);
}
module.exports.code = {
    name: "ship",
    description: "ships [TEXT1] (TEXT2)",
    group: "interact",
    usage: ["/PREFIX/ship [TEXT1] (TEXT2)"],
    accessableby: "Villagers",
    aliases: ["ship"]
}