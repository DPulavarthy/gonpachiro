module.exports.run = async (client, message, args, guild) => {
    if (!args[0]) return client.src.invalid(message, module.exports.code.title, guild)
    let load = client.src.loading(guild)
    let loading = await message.channel.send(load.embed)
    try {
        require(`weather-js`).find({ search: args.join(` `), degreeType: `F` }, async (error, result) => {
            if (error) client.error(error)
            if (!result || result.length < 1) return guild.errors ? setTimeout(async () => loading.edit(client.comment(client.comment(`ERROR: Requested location not found!`))), load.time) : null
            if (result.length < 2) return setTimeout(async () => embedify(result[0]), load.time)
            let [pick, collect] = [[], new Map()]
            for (let i = 0; i < result.length; i++) {
                pick.push(`\`${i + 1}.)\` ${result[i].location.name}`)
                collect.set(i + 1, result[i])
            }
            setTimeout(async () => {
                let data = collect.get(await input(pick))
                if (!data) return loading.edit(client.comment(`Timed out`))
                return embedify(data)
            }, load.time)
        })
    } catch (error) { return guild.errors ? setTimeout(async () => loading.edit(client.comment(`ERROR: ${error}`)), load.time) : null }

    async function input(pick) {
        let [msg, filter] = [
            await loading.edit(client.embed({ title: `Multiple Locations found, please pick one!` }).setDescription(`Send the number that corresponds with the location you requested\n\n${pick.join(`\n`)}`)),
            collected => collected.author.id === message.author.id && !isNaN(parseInt(collected.content)) && parseInt(collected.content) < pick.length && parseInt(collected.content) > 0
        ]
        collected = await msg.channel.awaitMessages(filter, { max: 1, time: 15 * 1000 })
        return collected.first() ? parseInt(collected.first().content) : null
    }

    async function embedify(data) {
        let field = []
        field.push(`\u279c Name: ${data.location.name || `N/A`}`)
        field.push(`\u279c Latitue: ${data.location.lat || `N/A`}`)
        field.push(`\u279c Longitude: ${data.location.long || `N/A`}`)
        field.push(`\u279c Timezone: ${data.location.timezone ? `GMT${data.location.timezone}` : `N/A`}`)
        let embed = client.embed({ title: `Forecast for ${data.location.name}` }).addField(`Location Information`, field.join(`\n`))
        for await (let day of data.forecast) {
            let field = []
            field.push(`\u279c Low Temp: ${day.low || `N/A`}`)
            field.push(`\u279c High Temp: ${day.high || `N/A`}`)
            field.push(`\u279c Sky: ${day.skytextday || `N/A`}`)
            field.push(`\u279c Day: ${day.shortday || `N/A`} ${guild.premium ? (day.date ? `[${day.date}]` : ``) : ``}`)
            field.push(`\u279c Precipitation: ${day.precip || `N/A`}`)
            embed.addField(`Forecast for ${day.day}`, field.join(`\n`))
        }
        return loading.edit(embed)
    }
}

module.exports.code = {
    title: `forecast`,
    about: `Forecasted weather information for given parameters`,
    param: [`CITY`],
}