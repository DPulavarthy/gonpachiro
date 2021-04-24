module.exports.run = async (client, message, args, guild) => {
    if (!args[0]) return client.src.invalid(message, module.exports.code.title, guild)
    require(`weather-js`).find({ search: args.join(` `), degreeType: `F` }, async (error, result) => {
        if (error) client.error(error)
        if (!result || result.length < 1) return message.channel.send(client.comment(`ERROR: Requested location not found!`).setColor(client.util.id.failed))
        if (result.length < 2) return output(result[0])
        let [pick, collect, i] = [[], new Map(), 1]
        for await (let data of result) {
            pick.push(`\`${i}.)\` ${data.location.name}`)
            collect.set(i, data)
            i++
        }
        let data = collect.get(await input(pick))
        if (!data) return message.channel.send(client.comment(`Timed out`))
        return output(data)
    })

    async function input(pick) {
        let msg = await message.channel.send(client.embed().setAuthor(`Multiple Locations found, please pick one!`, null, client.util.link.support).setDescription(`Send the number that corresponds with the location you requested\n\n${pick.join(`\n`)}`))
        let filter = collected => collected.author.id === message.author.id && !isNaN(parseInt(collected.content)) && parseInt(collected.content) < pick.length && parseInt(collected.content) > 0
        collected = await msg.channel.awaitMessages(filter, { max: 1, time: 15 * 1000, })
        return collected.first() ? parseInt(collected.first().content) : null
    }

    async function output(data) {
        let field = []
        field.push(`\u279c Name: ${data.location.name || `N/A`}`)
        field.push(`\u279c Latitue: ${data.location.lat || `N/A`}`)
        field.push(`\u279c Longitude: ${data.location.long || `N/A`}`)
        field.push(`\u279c Timezone: ${data.location.timezone ? `GMT${data.location.timezone}` : `N/A`}`)
        field.push(`\u279c Temperature: ${data.current.temperature ? `${data.current.temperature}\u00B0F | ${((parseInt(data.current.temperature) - 32) * (5 / 9)).toFixed(2)}\u00B0C` : `N/A`}`)
        field.push(`\u279c Sky: ${data.current.sytext || `N/A`}`)
        field.push(`\u279c Low Temp: ${data.forecast[1].low ? `${data.forecast[1].low}\u00B0F | ${((parseInt(data.forecast[1].low) - 32) * (5 / 9)).toFixed(2)}\u00B0C` : `N/A`}`)
        field.push(`\u279c High Temp: ${data.forecast[1].high ? `${data.forecast[1].high}\u00B0F | ${((parseInt(data.forecast[1].high) - 32) * (5 / 9)).toFixed(2)}\u00B0C` : `N/A`}`)
        field.push(`\u279c Current Day: ${guild.premium ?  data.current.day : data.current.shortday}`)
        field.push(`\u279c Windspeed: ${data.current.windspeed || `N/A`}`)
        return message.channel.send(client.embed().setAuthor(`Forecast for ${data.location.name}`, null, client.util.link.support).setDescription(field.join(`\n`)).setThumbnail(data.current.imageUrl))
    }
}

module.exports.code = {
    title: "weather",
    about: "Forecasted weather information for [CITY]",
    usage: ["%P%weather [CITY]"],
    alias: ["w"]
}