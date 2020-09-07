const Danbooru = require('danbooru');

module.exports.run = async (client, message, args, prefix) => {
    let messageArray = message.content.split(` `), cmd = messageArray[0].toLowerCase(), input = cmd.slice(prefix.length), type;
    switch (input) { case `seele`: type = `seele_vollerei`; break; case `bronya`: type = `bronya_zaychik`; break; case `fuhua`: type = `fu_hua`; break; case `teri`: type = `theresa_apocalypse`; break; case `kallen`: type = `kallen_kaslana`; break; case `mei`: type = `raiden_mei`; break; case `kiana`: type = `kiana_kaslana`; break; case `shinohi`: await message.channel.send(client.embed().setDescription(`This command was made for Shinohi#0015.\nTo have your own command [Donate to Jonin](${client.util.link.donate})`)); return client.src.log(message); };
    const booru = new Danbooru()
    booru.posts({ limit: 1, tags: `rating:safe ${type}`, random: true }).then(async posts => {
        posts.forEach(async post => {
            if (post.rating === `s` || post.rating === `e`) {
                const embed = client.embed()
                    .setTitle(`Random image for ${input}`)
                    .setDescription(`This command was made for Shinohi#0015.\nTo have your own command [Donate to Jonin](${client.util.link.donate})`)
                    .setURL(post.file_url)
                    .setImage(post.file_url)
                await message.channel.send(embed);
                return client.log(message);
            } else { message.channel.send(`This image seems to be tagged wrong and has NSFW content, try again`); return client.log(message); }
        })
    })
}

module.exports.code = {
    title: "shinohi",
    about: "A requested command from a patreon.",
    usage: ["%P%seele", "%P%bronya", "%P%teri", "%P%fuhua", "%P%kallen", "%P%mei", "%P%kiana"],
    alias: ["seele", "bronya", "teri", "fuhua", "kallen", "mei", "kiana"],
    dm: true,
}