module.exports.run = async (client, message, args) => {
    if (!args[0] || (args[0].toLowerCase() != `c` && args[0].toLowerCase() != `f` && args[0].toLowerCase() != `k`) || !args[1]) return client.src.invalid(message, module.exports.title, guild)
    let original = parseInt(args[1])
    if (!original || isNaN(original)) return message.channel.send(client.src.comment(`Must enter an integer`))
    else if (args[0].toLowerCase() === `c`) return message.channel.send(client.embed().setAuthor(`Converting from ${original} Celcius to Farenheit and Kelvin`, null, client.util.link.support).setDescription(`${original.toFixed(2)}°C\n${((original * (9 / 5)) + 32).toFixed(2)}°F\n${(original + 273.15).toFixed(2)}K`))
    else if (args[0].toLowerCase() === `f`) return message.channel.send(client.embed().setAuthor(`Converting from ${original} Farenheit to Celcius and Kelvin`, null, client.util.link.support).setDescription(`${original.toFixed(2)}°F\n${((original - 32) * (5 / 9)).toFixed(2)}°C\n${(((original - 32) * (5 / 9)) + 273.15).toFixed(2)}K`))
    else if (args[0].toLowerCase() === `k`) return message.channel.send(client.embed().setAuthor(`Converting from ${original} Kelvin to Farenheit and Celcius`, null, client.util.link.support).setDescription(`${original.toFixed(2)}K\n${(((original - 273.15) * (9 / 5)) + 32).toFixed(2)}°F\n${(original - 273.15).toFixed(2)}°C`))
}

module.exports.code = {
    title: "temp",
    about: "Converts temperature to different units",
    usage: ["%P%temp [c or f or k] [number]"],
}