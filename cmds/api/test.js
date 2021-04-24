module.exports.run = async (client, message, args, guild) => {
    // if (!args[0]) return client.src.invalid(message, module.exports.code.title, guild)
    require(`node-fetch`)(`https://services.superchiefyt.xyz/api/platform/twitch?key=${Buffer.from(process.env.API_ELARA, `base64`).toString(`ascii`)}&token=${Buffer.from(process.env.API_TWITCH, `base64`).toString(`ascii`)}&user=${encodeURIComponent(args.join(` `))}`).then(async res => {
        let body = await res.json()
        if (!body.status) return message.channel.send(client.comment(`ERROR: ${body.message}`))
        console.log(body)
    })
}

module.exports.code = {
    title: "test",
    about: "Information about [IP ADDRESS]",
    usage: ["%P%ip [IP ADDRESS]"]
}