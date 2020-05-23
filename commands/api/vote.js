const DBL = require("dblapi.js");

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let loading = await message.channel.send(client.send.loading()),
        multiplier = `No`,
        vote = `No`,
        points,
        monthly,
        user;
    if (!args.join(" ")) {
        user = message.author;
    } else {
        if (args.join(" ").toLowerCase() === `owner`) {
            user = message.guild.owner.user;
        } else {
            user = message.mentions.users.first() || await client.send.getUser(args.join(" "));
        }
        if (!user) return message.channel.send(`I was unable to get the user's information.`);
    }
    const dbl = new DBL(client.util.api.dbl, client);
    dbl.isWeekend().then(weekend => {
        try {
            dbl.hasVoted(user.id).then(voted => {
                dbl.getBot(client.util.id.client).then(async data => {
                    points = parseInt(data.points)
                    monthly = parseInt(data.monthlyPoints)
                    let field = ``;
                    field += `${client.arrow} ${user.username} voted: ${voted ? `Yes` : `No`}\n`;
                    field += `${client.arrow} ${client.user.username}'s total votes: ${points.toLocaleString()}\n`;
                    field += `${client.arrow} ${client.user.username}'s monthly votes: ${monthly.toLocaleString()}\n`;
                    field += `${client.arrow} Is weekend: ${weekend ? `Yes` : `No`}\n`;
                    field += `${client.arrow} Multiplier active: ${weekend ? `Yes` : `No`}\n`;
                    field += `${client.arrow} [Vote for ${client.user.username}](${client.util.link.vote})\n`;
                    const embed = client.send.embed()
                        .setTitle(`${client.user.username}'s Vote Info`)
                        .setDescription(field)
                    await loading.edit(embed)
                    return client.send.log(message);
                })

            })
        } catch (error) {
            loading.delete();
            client.send.report(message, error);
            return client.send.log(message);
        }
    });
}

module.exports.code = {
    name: "vote",
    description: "Vote info for /BOT/",
    group: "api",
    usage: ["/PREFIX/vote"],
    accessableby: "Villagers",
    aliases: ["vote"]
}