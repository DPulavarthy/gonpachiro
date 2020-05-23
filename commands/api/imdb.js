const { Client } = require('imdb-api');
const moment = require("moment");

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const imdb = new Client({ apiKey: client.util.api.imdb });
    let loading = await message.channel.send(client.send.loading())
    if (!args.join(" ")) {
        await loading.delete()
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    } else {
        imdb.get({ 'name': args.join(" ") }).then(async body => {
            let description = body.plot;
            if (description.length > 1024) {
                description = description.substring(0, 1021) + `...`
            }
            const embed = client.send.embed()
                .setTitle(body.title)
                .setURL(body.imdburl)
                .addField("Plot", description || "N/A", false)
                .addField("Actors", body.actors || "N/A", true)
                .addField("Genre", body.genres || "N/A", true)
                .addField("Language", body.languages || "N/A", true)
                .addField("Year", body.year || "N/A", true)
                .addField("Rated", body.rated || "N/A", true)
                .addField("Released", moment(body.released).format(`Do MMMM YYYY`) || "N/A", true)
                .addField("Runtime", body.runtime || "N/A", true)
                .addField("Director", body.director || "N/A", true)
                .addField("Awards", body.awards || "N/A", true)
                .addField("imdb Rating", body.rating || "N/A", true)
                .addField("DVD", body.dvd || "N/A", true)
                .addField("Box Office", body.boxoffice || "N/A", true)
                .setThumbnail(body.poster)

            let rate = Math.round(body.rating / 2),
                rating = `Rating(${body.rating}/10): `;
            for (let i = 0; i < 5; i++) {
                if (i <= rate) {
                    rating += client.emojis.cache.get(client.util.emoji.glow_star).toString();
                } else {
                    rating += client.emojis.cache.get(client.util.emoji.empty_star).toString();
                }
            }
            embed.setDescription(rating);
            await loading.edit(embed);
            return client.send.log(message);
        }).catch(async error => {
            await loading.edit(`Movie not found, error: ${error}`)
            return client.send.log(message);
        })
    }
}

module.exports.code = {
    name: "imdb",
    description: "Information about a movie from the IMDB database",
    group: "api",
    usage: ["/PREFIX/imdb [MOVIE]"],
    accessableby: "Villagers",
    aliases: ["imdb", "omdb", "movie"]
}