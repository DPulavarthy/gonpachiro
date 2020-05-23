const weather = require('weather-js')

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!args.join(" ")) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    }
    weather.find({ search: args.join(" "), degreeType: 'F' }, async function (error, result) {
        if (error) { return client.send.report(message, error); }
        if (result === undefined || result.length === 0) {
            await message.channel.send(client.send.error(`Requested location not found!`))
            return client.send.log(message);
        } else {
            try {
                let location = result[0].location,
                    field = ``;

                field += `${client.arrow} Name: ${location.name}\n`;
                field += `${client.arrow} Timezone: GMT${location.timezone || `N/A`}\n`;
                field += `${client.arrow} Latitude: ${location.lat}\n`;
                field += `${client.arrow} Longitude: ${location.long}\n`;

                const embed = client.send.embed()
                    .setAuthor(`Forecast for ${location.name}`, client.util.link.logo, client.util.link.support)
                    .addField(`Location`, field, false)
                for (let i = 0; i < 5; i++) {
                    let forecast = result[0].forecast[i],
                        field = ``;

                    field += `${client.arrow} Low: ${forecast.low || `N/A`}°F/${((parseInt(forecast.low) - 32) * (5 / 9)).toFixed(2) || `N/A`}°C\n`;
                    field += `${client.arrow} High: ${forecast.high || `N/A`}°F/${((parseInt(forecast.high) - 32) * (5 / 9)).toFixed(2) || `N/A`}°C\n`;
                    field += `${client.arrow} Sky: ${forecast.skytextday}\n`;
                    field += `${client.arrow} Day: ${forecast.day || `N/A`}\n`;
                    field += `${client.arrow} Date: ${forecast.date || `N/A`}\n`;
                    field += `${client.arrow} Precipitation: ${forecast.precip || 0}%`;

                    embed.addField(`Forecast for ${location.name} on ${forecast.shortday}`, field, false)
                }
                await message.channel.send(embed);
                return client.send.log(message);
            } catch (error) {
                client.send.report(message, error)
                return client.send.log(message)
            }
        }
    })
}

module.exports.code = {
    name: "forecast",
    description: "Forecasted weather information for [CITY]",
    group: "api",
    usage: ["/PREFIX/forecast [CITY]"],
    accessableby: "Villagers",
    aliases: ["forecast", "f"]
}