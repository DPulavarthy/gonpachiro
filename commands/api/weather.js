module.exports.run = async (client, message, args, prefix) => {
    let loading = await message.channel.send(client.src.loading());
    if (!args.join(` `)) { loading.edit(); return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    let { body } = await require(`superagent`).get(`http://api.openweathermap.org/data/2.5/weather?q=${args.join(` `)}&units=imperial&appid=${client.key.weather}`).catch(error => { loading.delete(); message.channel.send(client.src.comment(`ERROR: ${error}`)); return client.log(message); });
    require(`weather-js`).find({ search: args.join(" "), degreeType: 'F' }, async function (error, result) {
        if (error) { client.error(error); }
        if (!result || result.length < 1) { await loading.edit(client.src.comment(`Requested location not found!`)); return client.log(message); };
        try {
            let forecast = body.weather[0].main, current = result[0].current, location = result[0].location, ctemp = ((parseInt(current.temperature) - 32) * (5 / 9)).toFixed(2), cfeel = ((parseInt(current.feelslike) - 32) * (5 / 9)).toFixed(2), loc = [], currently = [];
            loc.push(`${client.arrow} Name: ${location.name}`);
            loc.push(`${client.arrow} Timezone: GMT${location.timezone || `N/A`}`);
            loc.push(`${client.arrow} Latitude: ${location.lat}`);
            loc.push(`${client.arrow} Longitude: ${location.long}`);
            currently.push(`${client.arrow} Temperature: ${current.temperature || `N/A`}°F/${ctemp || `N/A`}°C`);
            currently.push(`${client.arrow} Lowest Temp: ${Math.round(body.main.temp_min)}°F/${Math.round((body.main.temp_min - 32) * (5 / 9))}°C`);
            currently.push(`${client.arrow} Highest Temp: ${Math.round(body.main.temp_max)}°F/${Math.round((body.main.temp_max - 32) * (5 / 9))}°C`);
            currently.push(`${client.arrow} Forecast: ${forecast || `N/A`}`);
            currently.push(`${client.arrow} Sky: ${current.skytext || `N/A`}`);
            currently.push(`${client.arrow} Day: ${current.day}`);
            currently.push(`${client.arrow} Date: ${current.date || `N/A`}`);
            currently.push(`${client.arrow} Last observed: ${current.observationtime || `N/A`} @ ${current.observationpoint || `N/A`}`);
            currently.push(`${client.arrow} Feels like: ${current.feelslike || `N/A`}°F/${cfeel || `N/A`}°C`);
            currently.push(`${client.arrow} Humidity: ${current.humidity}%`);
            currently.push(`${client.arrow} Wind speed: ${current.winddisplay}`);
            loading.edit(client.embed().setAuthor(`Weather for ${location.name} on a ${current.shortday}`).addField(`Location`, loc).addField(`Currently`, currently).setThumbnail(current.imageUrl));
            return client.log(message);
        } catch (error) { loading.edit(client.src.comment(`ERROR: ${error}`)); return client.log(message); }
    })

}

module.exports.code = {
    title: "weather",
    about: "Forecasted weather information for [CITY]",
    usage: ["%P%weather [CITY]"],
    alias: ["w"],
    dm: true,
}