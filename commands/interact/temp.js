module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const embed = client.send.embed();

    if (!args.join("") || (args[0].toLowerCase() != `c` && args[0].toLowerCase() != `f` && args[0].toLowerCase() != `k`) || !args[1]) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    }
    let original = parseInt(args[1]);
    if (!original || original === `NaN`) {
        await message.channel.send(client.send.error(`Must enter an integer`))
        return client.send.log(message);
    }

    if (args[0].toLowerCase() === `c`) {
        embed
            .setAuthor(`Converting from ${original} Celcius to Farenheit and Kelvin`, `https://i.imgur.com/XIFNQ4o.png`, client.util.link.support)
            .setDescription(`${original.toFixed(2)}°C\n${((original * (9 / 5)) + 32).toFixed(2)}°F\n${(original + 273.15).toFixed(2)}K`)
        await message.channel.send(embed);
        return client.send.log(message);
    }

    if (args[0].toLowerCase() === `f`) {
        embed
            .setAuthor(`Converting from ${original} Farenheit to Celcius and Kelvin`, `https://i.imgur.com/Uoixmg7.png`, client.util.link.support)
            .setDescription(`${original.toFixed(2)}°F\n${((original - 32) * (5 / 9)).toFixed(2)}°C\n${(((original - 32) * (5 / 9)) + 273.15).toFixed(2)}K`)
        await message.channel.send(embed);
        return client.send.log(message);
    }


    if (args[0].toLowerCase() === `k`) {
        embed
            .setAuthor(`Converting from ${original} Kelvin to Farenheit and Celcius`, `https://i.imgur.com/TmNWqQH.png`, client.util.link.support)
            .setDescription(`${original.toFixed(2)}K\n${(((original - 273.15) * (9 / 5)) + 32).toFixed(2)}°F\n${(original - 273.15).toFixed(2)}°C`)
        await message.channel.send(embed);
        return client.send.log(message);
    }

}

module.exports.code = {
    name: "temp",
    description: "Converts temperature to different units",
    group: "interact",
    usage: ["/PREFIX/temp [c o f or k] [number]"],
    accessableby: "Villagers",
    aliases: ["temp", "temperature", "tempconvert", "temperatureconvert"]
}