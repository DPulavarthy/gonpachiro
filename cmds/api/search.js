module.exports.run = async (client, message, args, guild) => {
    if (!args.join(` `)) return client.src.invalid(message, module.exports.code.title, guild)
    require(`node-fetch`)(`https://www.googleapis.com/customsearch/v1?key=${client.util.key.google}&cx=002179459082311215073:avnitmw59ol&q=${args.join(` `)}`).then(async res => {
        let body = await res.json()
        let result = parseInt(body.searchInformation.formattedTotalResults)
        if (result === 0) return message.channel.send(embed.setTitle(`No results for the search term`).setColor(client.util.embed.failed))
        let embed = client.embed().setTitle(`Top 5 search results for ${args.join(` `)}`).setDescription(`\`Search Time: ${body.searchInformation.formattedSearchTime}s | Total Results: ${body.searchInformation.formattedTotalResults}\``)
        for (let i = 0; i < 5; i++) embed.addField(`\u200b`, `${i + 1}.) [${body.items[i].title || `N/A`}](${body.items[i].link || `N/A`})`, false).addField(`Description`, body.items[i].snippet || `N/A`)
        message.channel.send(embed)
    })
}

module.exports.code = {
    title: "search",
    about: "Searches for [TEXT] using the Google API",
    usage: ["%P%search [TEXT]"],
    alias: ["s", "google"]
}