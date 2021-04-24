const lookup = require(`country-code-lookup`)

module.exports.run = async (client, message, args, guild) => {
    let [loading, input, check] = [await message.channel.send(client.src.loading()), ``]
    if (!args[0]) check = lookup.byCountry(`United States`)
    else {
        for await (let arg of args) input += arg.substring(0, 1).toUpperCase() + arg.substring(1)
        try { check = lookup.byCountry(input) || lookup.byIso(input) || lookup.byFips(input) }
        catch (error) { return loading.edit(client.src.comment(`Location not found, error: ${error}`)) }
    }
    require(`node-fetch`)(`http://newsapi.org/v2/top-headlines?country=${check.iso2}&apiKey=${client.util.key.news}`).then(async res => {
        let body = await res.json()
        if (body.status !== `ok`) return loading.edit(client.comment(`ERROR: An error has occured while trying to get the data!`))
        let embed = client.embed()
            .setAuthor(`Top News for ${check.country} [${body.totalResults} results]`, null, client.util.link.support)
        let count = guild.premium ? 5 : 3
        for (let i = 0; i < count; i++) {
            embed
                .addField(`\u200b`, `${i + 1}.) [${body.articles[i].title || `N/A`}](${body.articles[i].url || `N/A`})\n**\`${body.articles[i].publishedAt.substring(0, body.articles[i].publishedAt.indexOf(`T`))}\`**`)
                .addField(`Description`, body.articles[i].description || `N/A`)
        }
        loading.edit(embed)
    })
}

module.exports.code = {
    title: "news",
    about: "Top news for (COUNTRY) / United States Default",
    usage: ["%P%news (COUNTRY)"]
}