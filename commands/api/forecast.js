module.exports.run = async (client, message, args, prefix) => {
    if (!args.join(` `)) { return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    require(`weather-js`).find({ search: args.join(` `), degreeType: 'F' }, async function (error, result) {
        if (error) { client.error(error); };
        if (!result || result.length < 1) { message.channel.send(client.src.comment(`Requested location not found!`)); return client.log(message); }
        else {
            try {
                let location = result[0].location, field = [];
                field.push(`${client.arrow} Name: ${location.name}`);
                field.push(`${client.arrow} Timezone: GMT${location.timezone || `N/A`}`);
                field.push(`${client.arrow} Latitude: ${location.lat}`);
                field.push(`${client.arrow} Longitude: ${location.long}`);
                const embed = client.embed().setAuthor(`Forecast for ${location.name}`, client.util.link.logo, client.util.link.support).addField(`Location`, field, false)
                for (let i = 0; i < 5; i++) {
                    let forecast = result[0].forecast[i], field = [];
                    field.push(`${client.arrow} Low: ${forecast.low || `N/A`}°F/${((parseInt(forecast.low) - 32) * (5 / 9)).toFixed(2) || `N/A`}°C`);
                    field.push(`${client.arrow} High: ${forecast.high || `N/A`}°F/${((parseInt(forecast.high) - 32) * (5 / 9)).toFixed(2) || `N/A`}°C`);
                    field.push(`${client.arrow} Sky: ${forecast.skytextday}`);
                    field.push(`${client.arrow} Day: ${forecast.day || `N/A`}`);
                    field.push(`${client.arrow} Date: ${forecast.date || `N/A`}`);
                    field.push(`${client.arrow} Precipitation: ${forecast.precip || 0}%`);
                    embed.addField(`Forecast for ${location.name} on ${forecast.shortday}`, field, false)
                }
                await message.channel.send(embed);
                return client.log(message);
            } catch (error) { client.error(error); return client.log(message); };
        }
    })
}

module.exports.code = {
    title: "forecast",
    about: "Forecasted weather information for [CITY]",
    usage: ["%P%forecast [CITY]"],
    alias: ["f"]
}