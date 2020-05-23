const Danbooru = require('danbooru');

module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let messageArray = message.content.split(" "),
        cmd = messageArray[0].toLowerCase(),
        input = cmd.slice(client.config.prefix.length),
        key;
    if (input === `seele`) {
        key = `seele_vollerei`;
    } else if (input === `bronya`) {
        key = `bronya_zaychik`;
    } else if (input === `fuhua`) {
        key = `fu_hua`;
    } else if (input === `theresa` || input === `teri`) {
        key = `theresa_apocalypse`;
    } else if (input === `kallen`) {
        key = `kallen_kaslana`;
    } else if (input === `shinohi`) {
        await message.channel.send(client.send.embed().setDescription(`This command was made for Shinohi#0015.\nTo have your own command [Donate to Jonin](${client.util.link.donate})`));
        return client.send.log(message);
    }

    const booru = new Danbooru()
    booru.posts({ limit: 1, tags: `rating:safe ${key}`, random: true }).then(async posts => {
        posts.forEach(async post => {
            if (post.rating === `s` || post.rating === `e`) {
                const embed = client.send.embed()
                    .setTitle(`Random image for ${input}`)
                    .setDescription(`This command was made for Shinohi#0015.\nTo have your own command [Donate to Jonin](${client.util.link.donate})`)
                    .setURL(post.file_url)
                    .setImage(post.file_url)
                await message.channel.send(embed);
                return client.send.log(message);
            } else {
                message.channel.send(`This image seems to be tagged wrong and has NSFW content, try again`)
            }
        })
    })
}

module.exports.code = {
    name: "shinohi",
    description: "A requested command from a patreon.",
    group: "requests",
    usage: ["/PREFIX/seele", "/PREFIX/bronya", "/PREFIX/theresa <teri>", "/PREFIX/fuhua", "/PREFIX/kallen"],
    accessableby: "Villagers",
    aliases: ["seele", "bronya", "teri", "theresa", "fuhua", "kallen"]
}