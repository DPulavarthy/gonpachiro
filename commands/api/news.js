const lookup = require(`country-code-lookup`);

module.exports.run = async (client, message, args) => {
    let loading = await message.channel.send(client.src.loading()), check, input = ``;
    if (!args.join(` `)) { check = lookup.byCountry(`United States`); }
    else {
        args.forEach(arg => { input += arg.substring(0, 1).toUpperCase() + arg.substring(1); })
        try { check = lookup.byCountry(input) || lookup.byIso(input) || lookup.byFips(input); }
        catch (error) { loading.edit(client.src.comment(`Location not found, error: ${error}`)); return client.log(message); };
    }
    let { body } = await require(`superagent`).get(`http://newsapi.org/v2/top-headlines?country=${check.iso2}&apiKey=${client.key.news}`);
    const embed = client.src.embed(`http://newsapi.org/`).setTitle(`Top News for ${check.country}`).setDescription(`Total Results: ` + body.totalResults);
    for (let i = 0; i < 5; i++) { embed.addField(`\u200b`, `${i + 1}.) [${body.articles[i].title || `N/A`}](${body.articles[i].url || `N/A`})\n**\`${body.articles[i].publishedAt.substring(0, body.articles[i].publishedAt.indexOf(`T`))}\`**`).addField(`Description`, body.articles[i].description || `N/A`) };
    setTimeout(async () => { loading.edit(embed); }, 1000);
    return client.log(message);
}

module.exports.code = {
    title: "news",
    about: "Top news for (COUNTRY) / United States Default",
    usage: ["%P%news (COUNTRY)"],
    dm: true,
}
