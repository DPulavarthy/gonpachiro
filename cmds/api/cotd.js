module.exports.run = async (client, message, args, guild) => {
    let load = client.src.loading(guild)
    let loading = await message.channel.send(load.embed)
    try {
        require(`node-fetch`)(`https://api.nasa.gov/planetary/apod?api_key=${Buffer.from(process.env.API_NASA, `base64`).toString(`ascii`)}`).then(async res => {
            let body = await res.json()
            if (body.code) return guild.errors ? setTimeout(async () => loading.edit(client.comment(`ERROR: Code: ${body.code} | Reason: ${body.msg}`)), load.time) : null
            let description = `[\`Source ${body.media_type}\`](${body.hdurl ? (guild.premium ? body.hdurl : body.url) : body.url})\n${body.explanation}`
            let embed = client.embed({ title: `NASA's Content of the day: ${body.title}` })
                .setDescription(description.length > 2048 ? `${description.substring(0, 2045)}...` : description)
                .setImage(body.hdurl ? (guild.premium ? body.hdurl : body.url) : body.url)
            setTimeout(async () => loading.edit(embed), load.time)
        })
    } catch (error) { return guild.errors ? setTimeout(async () => loading.edit(client.comment(`ERROR: ${error}`)), load.time) : null }
}

module.exports.code = {
    title: `cotd`,
    about: `Content of the day provided by the NASA API`,
}

