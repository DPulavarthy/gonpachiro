const Nekos = require('nekos.life');
const neko = new Nekos();

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }
    let sfw = [
        "smug",
        "baka",
        "tickle",
        "slap",
        "poke",
        "pat",
        "neko", //nekoGif
        "meow",
        "lizard",
        "kiss",
        "hug",
        "foxgirl",
        "feed",
        "cuddle",
        "catgirl",
        "holo",
        "woof",
        "wallpaper",
        "goose",
        "gecg",
        "avatar"
    ],
        nsfw = [
            "hentai", //randomHentaiGif
            "pussy",
            "neko", //nekoGif
            "lesbian",
            "kuni",
            "cumsluts",
            "classic",
            "boobs",
            "bj",
            "anal",
            "avatar",
            "yuri",
            "trap",
            "tits",
            "solo", //girlSoloGif
            "girlsolo",
            "wank", //pussyWankGif
            "art", //pussyArt
            "catgirl", //kemonomimi
            "foxgirl", //kitsune
            "keta",
            "holoero",
            //"hentai",
            "futanari",
            "femdom",
            "feet", //feetGif
            "erofeet",
            //"feet",
            "ero",
            "erofox", //eroKitsune
            "erocat", //eroKemonomimi
            "eroneko",
            "eroyuri",
            "cumarts"
        ],
        sfwbody = [
            neko.sfw.smug(),
            neko.sfw.baka(),
            neko.sfw.tickle(),
            neko.sfw.slap(),
            neko.sfw.poke(),
            neko.sfw.pat(),
            neko.sfw.nekoGif(),
            neko.sfw.meow(),
            neko.sfw.lizard(),
            neko.sfw.kiss(),
            neko.sfw.hug(),
            neko.sfw.foxGirl(),
            neko.sfw.feed(),
            neko.sfw.cuddle(),
            neko.sfw.kemonomimi(),
            neko.sfw.holo(),
            neko.sfw.woof(),
            neko.sfw.wallpaper(),
            neko.sfw.goose(),
            neko.sfw.gecg(),
            neko.sfw.avatar()
        ],
        nsfwbody = [
            neko.nsfw.randomHentaiGif(),
            neko.nsfw.pussy(),
            neko.nsfw.nekoGif(),
            neko.nsfw.lesbian(),
            neko.nsfw.kuni(),
            neko.nsfw.cumsluts(),
            neko.nsfw.classic(),
            neko.nsfw.boobs(),
            neko.nsfw.bJ(),
            neko.nsfw.anal(),
            neko.nsfw.avatar(),
            neko.nsfw.yuri(),
            neko.nsfw.trap(),
            neko.nsfw.tits(),
            neko.nsfw.girlSoloGif(),
            neko.nsfw.pussyWankGif(),
            neko.nsfw.pussyArt(),
            neko.nsfw.kemonomimi(),
            neko.nsfw.kitsune(),
            neko.nsfw.keta(),
            neko.nsfw.holoEro(),
            neko.nsfw.futanari(),
            neko.nsfw.femdom(),
            neko.nsfw.feetGif(),
            neko.nsfw.eroFeet(),
            neko.nsfw.ero(),
            neko.nsfw.eroKitsune(),
            neko.nsfw.eroKemonomimi(),
            neko.nsfw.eroNeko(),
            neko.nsfw.eroYuri(),
            neko.nsfw.cumArts()
        ];

    let messageArray = message.content.split(" "),
        cmd = messageArray[0].toLowerCase(),
        input = cmd.slice(client.config.prefix.length);

    if (message.mentions.users.first()) {
        user = message.guild.members.cache.get(message.mentions.users.first().id);
    } else {
        user = message.guild.members.cache.get(message.author.id);
    }
    if (input === `sfw` || input === `nsfw`) {
        const embed = client.send.embed()
        let list = ``;
        if (input === `sfw`) {
            sfw.forEach(key => {
                list += `${client.config.prefix}${key}\n`
            })
            embed.setTitle(`SFW command list`)
        }
        if (input === `nsfw`) {
            nsfw.forEach(key => {
                list += `${client.config.prefix}${key}\n`
            })
            embed
                .setAuthor(`(Avaliable in NSFW channel only, use ${client.config.prefix}nsfwcheck to check)`, client.util.link.logo, client.util.link.support)
                .setTitle(`NSFW command list`)
        }
        await message.channel.send(embed.setDescription(list));
        return client.send.log(message);
    }
    if (message.channel.nsfw) {
        let exists = false,
            i = 0;
        nsfw.forEach(key => {
            if (key === input) {
                exists = true;
                loc = i;
            }
            i++;
        })
        if (exists) {
            try {
                nsfwbody[loc].then(content => {
                    const embed = client.send.embed()
                    if (message.author.id === user.id) {
                        embed
                            .setDescription(message.author.toString() + ` wants to give themselves a ${nsfw[loc]}!`)
                            .setImage(content.url);

                    } else {
                        embed
                            .setDescription(message.author.toString() + ` wants to give ` + user.toString() + ` a ${nsfw[loc]}!`)
                            .setImage(content.url);
                    }
                    message.channel.send(embed);
                    return client.send.log(message);
                })
            } catch (error) {
                message.channel.send(`Something went wrong, error: ${error}`);
                return client.send.log(message);
            }
        }
        exists = false;
        i = 0;
        sfw.forEach(key => {
            if (key === input) {
                exists = true;
                loc = i;
            }
            i++;
        })
        if (exists) {
            try {
                sfwbody[loc].then(content => {
                    const embed = client.send.embed()
                    if (message.author.id === user.id) {
                        embed
                            .setDescription(message.author.toString() + ` wants to give themselves a ${sfw[loc]}!`)
                            .setImage(content.url);

                    } else {
                        embed
                            .setDescription(message.author.toString() + ` wants to give ` + user.toString() + ` a ${sfw[loc]}!`)
                            .setImage(content.url);
                    }
                    message.channel.send(embed);
                    return client.send.log(message);
                })
            } catch (error) {
                message.channel.send(`Something went wrong, error: ${error}`);
                return client.send.log(message);
            }
        } 
    }
    if (!message.channel.nsfw) {
        let exists = false,
            i = 0;
        sfw.forEach(key => {
            if (key === input) {
                exists = true;
                loc = i;
            }
            i++;
        })
        if (exists) {
            try {
                sfwbody[loc].then(content => {
                    const embed = client.send.embed()
                    if (message.author.id === user.id) {
                        embed
                            .setDescription(message.author.toString() + ` wants to give themselves a ${sfw[loc]}!`)
                            .setImage(content.url);

                    } else {
                        embed
                            .setDescription(message.author.toString() + ` wants to give ` + user.toString() + ` a ${sfw[loc]}!`)
                            .setImage(content.url);
                    }
                    message.channel.send(embed);
                    return client.send.log(message);
                })
            } catch (error) {
                message.channel.send(`Something went wrong, error: ${error}`);
                return client.send.log(message);
            }
        } else {
            nsfw.forEach(key => {
                if (key === input) {
                    exists = true;
                }
            })
            if (exists) {
                client.send.nsfw(message);
                return client.send.log(message);
            }
        }
    }
}

module.exports.code = {
    name: "neko",
    description: "A random gif related to [TEXT]",
    group: "api",
    usage: ["/PREFIX/sfw", "/PREFIX/nsfw"],
    accessableby: "Villagers",
    aliases: ["sfw", "nsfw", "neko", "smug", "baka", "tickle", "slap", "poke", "pat", "neko", "meow", "lizard", "kiss", "hug", "foxgirl", "feed", "cuddle", "catgirl", "holo", "woof", "wallpaper", "goose", "gecg", "avatar", "hentai", "pussy", "lesbian", "kuni", "cumsluts", "classic", "boobs", "bj", "anal", "yuri", "trap", "tits", "solo", "girlsolo", "wank", "art", "keta", "holoero", "futanari", "femdom", "feet", "erofeet", "ero", "erofox", "erocat", "eroNeko", "eroyuri", "cumarts", "blowjob"]
}