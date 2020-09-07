module.exports.run = async (client, message, args) => {
    if (!args.join(` `) || args.join(` `).toLowerCase() === `all`) {
        let i = 1, field = [];
        client.error.code.forEach(err => { field.push(`**\`Code ${i}.)\`** ${err}`); i++; });
        await message.channel.send(client.embed().setDescription(field.join(`\n`)));
        return client.log(message);
    }
    let code = client.error.code.get(Math.floor(parseInt(args.join(` `))));
    if (code) { message.channel.send(client.embed().addField(`Code ${Math.floor(parseInt(args.join(` `)))}`, code)); return client.log(message); }
    else { await message.channel.send(client.embed().addField(`Invalid Code`, `Codes only go from 1 to ${client.error.code.size}`, true)); return client.log(message); };
}

module.exports.code = {
    title: "errcodes",
    about: "Error types for %B%",
    usage: ["%P%errcodes (ERROR CODE)"],
    alias: ["err"]
}