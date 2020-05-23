let Filter = require('bad-words'),
    filter = new Filter();

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let loading = await message.channel.send(client.send.loading()),
        input = args.join(" "),
        hiro = client.send.hiro(message, args);
    const embed = client.send.embed(`https://www.google.com/`);

    if (!input) {
        await loading.delete();
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    }
    else {
        filter.addWords(`hentai`, `loli`);
        if (filter.isProfane(args.join(" ")) && !message.channel.nsfw && !hiro) {
            await loading.delete()
            await client.send.nsfw(message);
            return client.send.log(message);
        }
        if (hiro) {
            input = args.splice(1).join(" ");
        }
        let { body } = await require(`superagent`).get(`https://www.googleapis.com/customsearch/v1?key=${client.util.api.google}&cx=002179459082311215073:avnitmw59ol&q=${input}`);
        result = parseInt(body.searchInformation.formattedTotalResults);
        if (result === 0) {
            await loading.edit(embed.setTitle(`No results for the search term`).setColor(client.util.embed.failed))
            return client.send.log(mesage);
        } else {
            embed
                .setTitle(`Top 5 search results for ${input}`)
                .addField(`Search Time`, body.searchInformation.formattedSearchTime + `s`, true)
                .addField(`Total Results`, body.searchInformation.formattedTotalResults, true)
                .addField(`\u200b`, `\u200b`, true)
            for (let i = 0; i < 5; i++) {
                embed
                    .addField(`\u200b`, `${i + 1}.) [${body.items[i].title || `N/A`}](${body.items[i].link || `N/A`})`, false)
                    .addField(`Description`, body.items[i].snippet || `N/A`, false)
            }
            await loading.edit(embed);
            return client.send.log(message);
        }
    }
}

module.exports.code = {
    name: "search",
    description: "Searches for [TEXT] using the Google API",
    group: "api",
    usage: ["/PREFIX/search [TEXT]"],
    accessableby: "Villagers",
    aliases: ["search", "s", "google"]
}