let moment = require(`moment`);
require(`moment-duration-format`)(moment);

module.exports.run = async (client, message, args) => {
    if (!args.join(` `)) {
        message.channel.send(`No valk ID provided, \'${client.prefix}list\' for more information.`)
    } else {
        let input = args[0].toLowerCase(), field = [];
        client.database.valks.find({ id: input }).toArray(async function (error, result) {
            if (error) { client.error(error); };
            if (result.length < 1) { return message.channel.send(client.src.comment(`That valk was not found, \'${client.prefix}list\' for the valk list.`)) };
            client.database.heads.find({ id: result[0].head }).toArray(async function (error, res) {
                if (error) { client.error(error); };
                client.database.guilds.find({ id: message.guild.id }).toArray(async function (error, body) {
                    if (error) { client.error(error); };
                    if (!args[1]) {
                        let type, claim = [], spawn;
                        if (body.length > 0) { body[0].data.filter(valk => { if (valk.case === result[0].id) { claim = [valk.rank, valk.points, valk.battle, valk.spawn] }; }); };
                        spawn = claim.length > 0 ? `${moment.duration(new Date().getTime() - claim[3]).format("w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds] ago")}` : `N/A`;
                        switch (result[0].type.toUpperCase()) { case `BIO`: type = `${client.emojis.cache.get(client.emoji.bio).toString()} - Biologic`; break; case `MECH`: type = `${client.emojis.cache.get(client.emoji.mech).toString()} - Mecha`; break; case `PSY`: type = `${client.emojis.cache.get(client.emoji.psy).toString()} - Psychic`; break; case `PSY`: type = `${client.emojis.cache.get(client.emoji.qua).toString()} - Quantum`; break; default: type = `Unknown`; };
                        field.push(`${client.arrow} Name: ${result[0].name}`);
                        field.push(`${client.arrow} ID: ${result[0].id}`);
                        field.push(`${client.arrow} Type: ${type}`);
                        field.push(`${client.arrow} Age: ${res[0].age}`);
                        field.push(`${client.arrow} Height: ${res[0].height}`);
                        field.push(`${client.arrow} Weight: ${res[0].weight}`);
                        field.push(`${client.arrow} Birthday: ${res[0].bday}`);
                        field.push(`${client.arrow} Claimed By Server: ${claim.length > 0 ? `Yes` : `No`}`);
                        field.push(`${client.arrow} Rank: ${claim.length > 0 ? claim[0] : `N/A`}`);
                        field.push(`${client.arrow} Points Cooldown: ${claim.length > 0 ? (claim[1] ? `On` : `Off`) : `N/A`}`);
                        field.push(`${client.arrow} Battle Cooldown: ${claim.length > 0 ? (claim[2] ? `On` : `Off`) : `N/A`}`);
                        field.push(`${client.arrow} Claimed: ${spawn}`);
                        client.database.valks.find({ head: result[0].head }).toArray(async function (error, res) {
                            if (error) { client.error(error); };
                            let other = [];
                            res.filter(valk => { if (valk.id !== input) { other.push(`${valk.name}: ${client.prefix}valk ${valk.id}`) }; });
                            field.push(`\nOther valks: ${client.src.code(other.join(`\n`))}`);
                            message.channel.send(client.embed().setAuthor(result[0].name, `https://i.imgur.com/${result[0].icon}.png`).setDescription(field.join(`\n`)).setImage(`https://i.imgur.com/${result[0].img}.png`));
                        })
                        return client.log(message);
                    } else {
                        switch (args[1].toUpperCase()) {
                            case `++`:
                                if (body.length < 1) { message.channel.send(client.src.comment(`${message.guild.name} does not have a game setup, run ${client.prefix}setup to start setting up ${client.user.username}.`)); }
                                else {
                                    body[0].data.forEach(valk => {
                                        if (valk.case === result[0].id) {
                                            if (valk.points) { message.channel.send(client.src.comment(`That valk is currently in points cooldown, wait until 12AM CST for the cooldown to reset.`)); }
                                            else {
                                                valk.rank++;
                                                valk.points = true;
                                                let res = { $set: { data: body[0].data } };
                                                client.database.guilds.updateOne({ id: message.guild.id }, res, function (error) { if (error) { client.src.error(error); } });
                                                message.react(client.emojis.cache.get(client.emoji.check));
                                            }
                                            return client.log(message);
                                        }
                                    })

                                };
                                break;
                            default: message.channel.send(client.src.comment(`Try \'${client.prefix}${module.exports.code.title} ${args[0]} ++\'`));
                        }
                        return client.log(message);
                    }
                })
            })
        })
    }
}

module.exports.code = {
    title: "valk",
    about: "List Charcter Info",
    usage: ["%P%valk [VALK_ID]", "%P%valk [VALK_ID] ++"],
}