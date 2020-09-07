const Danbooru = require('danbooru');

module.exports.run = async (client, message, args, prefix) => {
    let messageArray = message.content.split(` `), cmd = messageArray[0].toLowerCase(), input = cmd.slice(prefix.length), type;
    switch (input) { case `yae`: type = `yae_sakura`; break; case `neffr`: await message.channel.send(client.embed().setDescription(`This command was made for NEFFR#7606.\nTo have your own command [Donate to Jonin](${client.util.link.donate})`)); return client.src.log(message); };
    // if (input === `neffr`) {
    //     await message.channel.send(client.src.embed().setDescription(`This command was made for NEFFR#7606.\nTo have your own command [Donate to Jonin](${client.util.link.donate})`));
    //     return client.src.log(message);
    // }
    const booru = new Danbooru()
    booru.posts({ limit: 1, tags: `rating:safe ${type}`, random: true }).then(async posts => {
        posts.forEach(async post => {
            if (post.rating === `s` || post.rating === `e`) {
                const embed = client.embed()
                    .setTitle(`Random image for ${input}`)
                    .setDescription(`This command was made for NEFFR#7606.\nTo have your own command [Donate to Jonin](${client.util.link.donate})`)
                    .setURL(post.file_url)
                    .setImage(post.file_url)
                await message.channel.send(embed);
                return client.log(message);
            } else { message.channel.send(`This image seems to be tagged wrong and has NSFW content, try again`); return client.log(message); }
        })
    })
}

module.exports.code = {
    title: "neffr",
    about: "A requested command from a patreon.",
    usage: ["%P%yae"],
    alias: ["yae"],
    dm: true,
}