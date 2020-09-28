module.exports.run = async (client, message, args, prefix) => {
    if (!args.join("") || (args[0].toLowerCase() != `c` && args[0].toLowerCase() != `f` && args[0].toLowerCase() != `k`) || !args[1]) { return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); };
    let original = parseInt(args[1]);
    if (!original || isNaN(original)) { message.channel.send(client.src.comment(`Must enter an integer`)); return client.log(message); }
    if (args[0].toLowerCase() === `c`) { message.channel.send(client.embed().setAuthor(`Converting from ${original} Celcius to Farenheit and Kelvin`, `https://i.imgur.com/XIFNQ4o.png`, client.util.link.support).setDescription(`${original.toFixed(2)}°C\n${((original * (9 / 5)) + 32).toFixed(2)}°F\n${(original + 273.15).toFixed(2)}K`)); return client.log(message); };
    if (args[0].toLowerCase() === `f`) { message.channel.send(client.embed().setAuthor(`Converting from ${original} Farenheit to Celcius and Kelvin`, `https://i.imgur.com/Uoixmg7.png`, client.util.link.support).setDescription(`${original.toFixed(2)}°F\n${((original - 32) * (5 / 9)).toFixed(2)}°C\n${(((original - 32) * (5 / 9)) + 273.15).toFixed(2)}K`)); return client.log(message); }
    if (args[0].toLowerCase() === `k`) { message.channel.send(client.embed().setAuthor(`Converting from ${original} Kelvin to Farenheit and Celcius`, `https://i.imgur.com/TmNWqQH.png`, client.util.link.support).setDescription(`${original.toFixed(2)}K\n${(((original - 273.15) * (9 / 5)) + 32).toFixed(2)}°F\n${(original - 273.15).toFixed(2)}°C`)); return client.log(message); };
}

module.exports.code = {
    title: "temp",
    about: "Converts temperature to different units",
    usage: ["%P%temp [c or f or k] [number]"],
    dm: true,
}