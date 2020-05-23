const lookup = require('country-code-lookup');
const { get } = require(`superagent`);

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let loading = await message.channel.send(client.send.loading()),
        check;
    if (!args.join(" ")) {
        check = lookup.byCountry(`United States`);
    } else {
        let input = ``;
        args.forEach(arg => {
            input += arg.substring(0, 1).toUpperCase() + arg.substring(1);
        })
        try {
            check = lookup.byCountry(input) || lookup.byIso(input) || lookup.byFips(input);
        } catch (error) {
            await loading.edit(client.send.error(`Location not found, error: ${error}`));
            return client.send.log(message);
        }
    }
    let { body } = await get(`http://newsapi.org/v2/top-headlines?country=${check.iso2}&apiKey=${client.util.api.news}`);
    const embed = client.send.embed(`http://newsapi.org/`)
        .setTitle(`Top News for ${check.country}`)
        .setDescription(`Total Results: ` + body.totalResults)
    for (let i = 0; i < 5; i++) {
        let description;
        if (body.articles[i].description === ``) {
            description = `No description`;
        }
        else {
            description = body.articles[i].description;
        }

        embed.addField(`\u200b`, `${i + 1}.) [${body.articles[i].title || `N/A`}](${body.articles[i].url || `N/A`})\n\`${body.articles[i].publishedAt.substring(0, body.articles[i].publishedAt.indexOf(`T`))}\``)
        embed.addField(`Description`, description, false)
    }
    await loading.edit(embed);
    return client.send.log(message);
}

module.exports.code = {
    name: "news",
    description: "Top news for (COUNTRY) / United States Default",
    group: "api",
    usage: ["/PREFIX/news (COUNTRY)"],
    accessableby: "Villagers",
    aliases: ["news", "topnews"]
}