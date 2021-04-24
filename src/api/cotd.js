let fetch = require(`node-fetch`)

module.exports.run = async (client, message, args, guild) => {
    let [loading, res] = [await message.channel.send(client.embed().setTitle(`Loading...`)), await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.decode(process.env.NASA_API_ACCESS_TOKEN).data}`)]
    let body = await res.json()
    if (body.code) return loading.edit(client.comment(`ERROR: Code: ${body.code} | Reason: ${body.msg}`))
    let description = `[\`Source ${body.media_type}\`](${body.hdurl ? (guild.premium ? body.hdurl : body.url) : body.url})\n${body.explanation}`
    let embed = client.embed({ title: `NASA's Content of the day: ${body.title}` })
        .setDescription(description.length > 2048 ? `${description.substring(0, 2045)}...` : description)
        .setImage(body.hdurl ? (guild.premium ? body.hdurl : body.url) : body.url)
    setTimeout(() => loading.edit(embed), 1000)
}

module.exports.data = {
    title: `cotd`,
    about: `Content of the day provided by the NASA API`,
}