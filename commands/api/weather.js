const weather = require('weather-js')

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let loading = await message.channel.send(client.send.loading());
    if (!args.join(" ")) {
        await loading.delete();
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    }

    let { body } = await require(`superagent`).get(`http://api.openweathermap.org/data/2.5/weather?q=${args.join(" ")}&units=imperial&appid=${client.util.api.weather}`).catch(error => { loading.delete(); client.send.report(message, error); return client.send.log(message); });
    weather.find({ search: args.join(" "), degreeType: 'F' }, async function (error, result) {
        if (error) client.send.report(message, error);
        if (result === undefined || result.length === 0) {
            await loading.edit(client.send.error(`Requested location not found!`))
            return client.send.log(message);
        } else {
            try {
                let forecast = body.weather[0].main,
                    current = result[0].current,
                    location = result[0].location,
                    ctemp = ((parseInt(current.temperature) - 32) * (5 / 9)).toFixed(2),
                    cfeel = ((parseInt(current.feelslike) - 32) * (5 / 9)).toFixed(2),
                    loc = ``,
                    currently = ``;

                loc += `${client.arrow} Name: ${location.name}\n`;
                loc += `${client.arrow} Timezone: GMT${location.timezone || `N/A`}\n`;
                loc += `${client.arrow} Latitude: ${location.lat}\n`;
                loc += `${client.arrow} Longitude: ${location.long}\n`;

                currently += `${client.arrow} Temperature: ${current.temperature || `N/A`}°F/${ctemp || `N/A`}°C\n`;
                currently += `${client.arrow} Lowest Temp: ${Math.round(body.main.temp_min)}°F/${Math.round((body.main.temp_min - 32) * (5 / 9))}°C\n`;
                currently += `${client.arrow} Highest Temp: ${Math.round(body.main.temp_max)}°F/${Math.round((body.main.temp_max - 32) * (5 / 9))}°C\n`;
                currently += `${client.arrow} Forecast: ${forecast || `N/A`}\n`;
                currently += `${client.arrow} Sky: ${current.skytext || `N/A`}\n`;
                currently += `${client.arrow} Day: ${current.day}\n`;
                currently += `${client.arrow} Date: ${current.date || `N/A`}\n`;
                currently += `${client.arrow} Last observed: ${current.observationtime || `N/A`} @ ${current.observationpoint || `N/A`}\n`;
                currently += `${client.arrow} Feels like: ${current.feelslike || `N/A`}°F/${cfeel || `N/A`}°C\n`;
                currently += `${client.arrow} Humidity: ${current.humidity}%\n`;
                currently += `${client.arrow} Wind speed: ${current.winddisplay}\n`;

                const embed = client.send.embed()
                    .setAuthor(`Weather for ${location.name} on a ${current.shortday}`, client.util.link.logo, client.util.link.support)
                    .addField(`Location`, loc)
                    .addField(`Currently`, currently)
                    .setThumbnail(current.imageUrl)
                await loading.edit(embed);
                return client.send.log(message);
            } catch (error) {
                message.channel.send(`Location not found, error: `)
            }
        }
    })

}

module.exports.code = {
    name: "weather",
    description: "Forecasted weather information for [CITY]",
    group: "api",
    usage: ["/PREFIX/weather [CITY]"],
    accessableby: "Villagers",
    aliases: ["weather", "w"]
}