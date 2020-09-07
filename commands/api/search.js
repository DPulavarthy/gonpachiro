module.exports.run = async (client, message, args, prefix) => {
    if (!args.join(` `)) { return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    let { body } = await require(`superagent`).get(`https://www.googleapis.com/customsearch/v1?key=${client.key.google}&cx=002179459082311215073:avnitmw59ol&q=${args.join(` `)}`);
    result = parseInt(body.searchInformation.formattedTotalResults);
    if (result === 0) { await message.channel.send(embed.setTitle(`No results for the search term`).setColor(client.util.embed.failed)); return client.log(mesage); }
    const embed = client.embed().setTitle(`Top 5 search results for ${args.join(` `)}`).addField(`Search Time`, body.searchInformation.formattedSearchTime + `s`, true).addField(`Total Results`, body.searchInformation.formattedTotalResults, true);
    for (let i = 0; i < 5; i++) { embed.addField(`\u200b`, `${i + 1}.) [${body.items[i].title || `N/A`}](${body.items[i].link || `N/A`})`, false).addField(`Description`, body.items[i].snippet || `N/A`); };
    message.channel.send(embed);
    return client.log(message);
}

module.exports.code = {
    title: "search",
    about: "Searches for [TEXT] using the Google API",
    usage: ["%P%search [TEXT]"],
    alias: ["s", "google"],
    dm: true,
}