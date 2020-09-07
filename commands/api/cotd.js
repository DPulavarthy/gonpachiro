module.exports.run = async (client, message) => {
    let { body } = await require(`superagent`).get(`https://api.nasa.gov/planetary/apod?api_key=${client.key.nasa}`).catch(error => { return client.src.report(message, error); });
    const embed = client.embed(`https://www.nasa.gov/`)
        .setTitle(`NASA's Content of the day: ${body.title}`)
        .setURL(body.url)
        .setDescription(body.explanation.length > 2048 ? `${body.explanation.substring(0, 2045)}...` : body.explanation)
        .setImage(body.url)
    message.channel.send(embed);
    return client.log(message);
}

module.exports.code = {
    title: "cotd",
    about: "Content of the day provided by the NASA API",
    usage: ["%P%cotd"],
    alias: ["nasa"],
    dm: true,
}