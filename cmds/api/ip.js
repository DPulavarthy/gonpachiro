module.exports.run = async (client, message, args, guild) => {
    if (!args[0]) return client.src.invalid(message, module.exports.code.title, guild)
    let load = client.src.loading(guild)
    let loading = await message.channel.send(load.embed)
    try {
        require(`node-fetch`)(`http://ip-api.com/json/${args.join(` `)}?fields=33292287`).then(async res => {
            let [body, field] = [await res.json(), []]
            if (body.status === `fail`) return guild.errors ? setTimeout(async () => loading.edit(client.comment(`ERROR: Status: ${body.status} | Reason: ${body.query} is an ${body.message}`)), load.time) : null
            field.push(`\u279c Continent: [${body.continentCode || `N/A`}] ${body.continentCode ? (guild.premium ? body.continent : ``) : ``}`)
            field.push(`\u279c Country: [${body.countryCode || `N/A`}] ${body.countryCode ? (guild.premium ? body.country : ``) : ``}`)
            field.push(`\u279c Region: [${body.region || `N/A`}] ${body.region ? (guild.premium ? body.regionName : ``) : ``}`)
            field.push(`\u279c ZIP-Code: ${guild.premium ? (body.zip || `N/A`) : `\`Premium Feature\``}`)
            field.push(`\u279c City: ${guild.premium ? (body.city || `N/A`) : `\`Premium Feature\``}`)
            field.push(`\u279c Reverse IP: ${body.reverse || `N/A`}`)
            field.push(`\u279c District: ${body.district || `N/A`}`)
            field.push(`\u279c Timezone: ${body.timezone || `N/A`}`)
            field.push(`\u279c Currency: ${body.currency || `N/A`}`)
            field.push(`\u279c ASname: ${body.asname || `N/A`}`)
            field.push(`\u279c Longitude: ${body.lon || `N/A`}`)
            field.push(`\u279c Latitude: ${body.lat || `N/A`}`)
            field.push(`\u279c IP: ${body.query || `N/A`}`)
            field.push(`\u279c ISP: ${body.isp || `N/A`}`)
            field.push(`\u279c ORG: ${body.org || `N/A`}`)
            field.push(`\u279c AS: ${body.as || `N/A`}`)
            field.push(`\u279c ${body.hosting ? `\`\u2714\uFE0F\`` : `\`\u274C\``} Hosted`)
            field.push(`\u279c ${body.mobile ? `\`\u2714\uFE0F\`` : `\`\u274C\``} Mobile`)
            field.push(`\u279c ${body.proxy ? `\`\u2714\uFE0F\`` : `\`\u274C\``} Proxy`)
            let embed = client.embed().setAuthor(body.query ? body.query : args[0], null, guild.premium ? `` : client.util.link.donate)
            if (guild.premium) {
                require(`node-fetch`)(`https://api.nasa.gov/planetary/earth/assets?lon=${body.lon}&lat=${body.lat}&date=${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}&dim=0.2&api_key=${Buffer.from(process.env.API_NASA, `base64`).toString(`ascii`)}`).then(async nasa => {
                    let map = await nasa.json()
                    map.url ? field.push(`\u279c Local Map as of [${map.date.substring(0, map.date.indexOf(`T`))}](${map.url})`) : null
                })
            }
            setTimeout(async () => loading.edit(embed.setDescription(field.join(`\n`))), load.time)
        })
    } catch (error) { return guild.errors ? setTimeout(async () => loading.edit(client.comment(`ERROR: ${error}`)), load.time) : null }
}

module.exports.code = {
    title: "ip",
    about: "Information about [IP ADDRESS]",
    usage: ["%P%ip [IP ADDRESS]"]
}