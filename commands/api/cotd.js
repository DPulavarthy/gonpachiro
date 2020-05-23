module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let { body } = await require(`superagent`).get(`https://api.nasa.gov/planetary/apod?api_key=${client.util.api.nasa}`).catch(error => client.send.report(message, error)),
        description = body.explanation;
    if (description.length > 2048) {
        description = description.substring(0, 2045) + `...`
    }
    const embed = client.send.embed(`https://www.nasa.gov/`)
        .setTitle(`NASA's Content of the day : ${body.title}`)
        .setURL(body.url)
        .setDescription(description)
        .setImage(body.url)
    await message.channel.send(embed);
    return client.send.log(message);
}

module.exports.code = {
    name: "cotd",
    description: "Content of the day provided by the NASA API",
    group: "api",
    usage: ["/PREFIX/cotd"],
    accessableby: "Villagers",
    aliases: ["cotd", "contentoftheday", "nasa"]
}