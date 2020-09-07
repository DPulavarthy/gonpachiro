let moment = require(`moment`);
require(`moment-duration-format`)(moment);

module.exports.run = async (client, message, args, prefix) => {
    if (!args.join(` `)) {
        client.database.heads.find().toArray(async function (error, result) {
            if (error) { client.error(error); };
            let field = [];
            for (let valk of result) { field.push(`${valk.name}: ${prefix}${module.exports.code.title} ${valk.id}`); }
            field.push(`${prefix}${module.exports.code.title} valks\n${prefix}${module.exports.code.title} full`)
            message.channel.send(client.embed().setTitle(`Valkyries command list.`).setDescription(client.src.code(field.join(`\n`))));
            return client.log(message);
        })
    } else {
        switch (args.join(` `).toUpperCase()) {
            case `VALKS`:
                client.database.guilds.find({ id: message.guild.id }).toArray(async function (error, body) {
                    if (error) { client.error(error); };
                    if (body.length < 1) { message.channel.send(client.src.comment(`${message.guild.name} does not have a game setup, run ${prefix}setup to start setting up ${client.user.username}.`)); return client.log(message); };
                    let field = [`${client.arrow} Server Cooldown: ${body[0].cooldown ? `On` : `Off`}\n\nValks:`];
                    for (let valk of body[0].data) {
                        client.database.valks.find({ id: valk.case }).toArray(async function (error, result) {
                            if (error) { client.error(error); };
                            field.push(`**${result[0].name}:** Rank: ${valk.rank}\n[Battle CD: ${valk.battle ? `On` : `Off`}] [Point CD: ${valk.points ? `On` : `Off`}] [Info: ${prefix}valk ${valk.case}]\n`);
                        })
                    }
                    setTimeout(async () => { message.channel.send(client.embed().setTitle(`Valkyrie list for ${message.guild.name}`).setDescription(field.join(`\n`).length > 2000 ? `${field.join(`\n`).substring(0, 1997)}...` : field.join(`\n`))); }, 1000);
                    client.log(message);
                })
                break;
            case `FULL`:
                let list = [];
                client.database.guilds.find({ id: message.guild.id }).toArray(async function (error, body) {
                    if (error) { client.error(error); };
                    if (body.length < 1) { message.channel.send(client.src.comment(`${message.guild.name} does not have a game setup, run ${prefix}setup to start setting up ${client.user.username}.`)); return client.log(message); };
                    let loc = 1;
                    body[0].data.forEach(async valk => {
                        let field = [`${client.arrow} Server Cooldown: ${body[0].cooldown ? `On` : `Off`}\n\nInformation:`];
                        client.database.valks.find({ id: valk.case }).toArray(async function (error, result) {
                            if (error) { client.error(error); };
                            client.database.heads.find({ id: result[0].head }).toArray(async function (error, res) {
                                if (error) { client.error(error); };
                                let type, claim = [], spawn;
                                if (body.length > 0) { body[0].data.filter(valk => { if (valk.case === result[0].id) { claim = [valk.rank, valk.points, valk.battle, valk.spawn] }; }); };
                                spawn = claim.length > 0 ? `${moment.duration(new Date().getTime() - claim[3]).format("w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds]")}` : `N/A`;
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
                                    res.filter(character => { if (character.id !== result[0].id) { other.push(`${character.name}: ${prefix}valk ${character.id}`) }; });
                                    field.push(`\nOther valks: ${client.src.code(other.join(`\n`))}`);
                                    let embed = client.embed().setAuthor(`${result[0].name} [${loc}/${body[0].data.length}]`, `https://i.imgur.com/${result[0].icon}.png`).setDescription(field.join(`\n`)).setImage(`https://i.imgur.com/${result[0].img}.png`)
                                    loc++;
                                    list.push(embed);
                                })
                            })
                        })
                    })
                    let msg = await message.channel.send(client.embed().setTitle(`Valkyrie list for ${message.guild.name}`).setDescription(`\"${client.emojis.cache.get(client.emoji.back).toString()}\" and \"${client.emojis.cache.get(client.emoji.next).toString()}\" to navigate`)), i = 0, back = client.emojis.cache.get(client.emoji.back), next = client.emojis.cache.get(client.emoji.next);

                    await msg.react(back);
                    await msg.react(next);
                    let filter = (reaction, user) => [back.name, next.name].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
                    let collector = msg.createReactionCollector(filter);

                    collector.on('collect', async (reaction) => {
                        reaction.users.remove(message.author.id)
                        if (reaction.emoji.name === back.name) { if (i <= 1) return; i--; };
                        if (reaction.emoji.name === next.name) { if (i === list.length) return; i++; };
                        msg.edit(list[i - 1]);
                    });
                    setTimeout(async () => { msg.reactions.removeAll(); collector.stop(); }, body[0].data.length * 45 * 1000);
                    client.log(message);
                })
                break;
            default:
                client.database.heads.find({ id: args.join(` `) }).toArray(async function (error, result) {
                    if (error) { client.error(error); };
                    if (result.length < 1) { return message.channel.send(client.src.comment(`That valk was not found, \'${prefix}${module.exports.code.title}\' for the valk list.`)) };
                    client.database.valks.find({ head: result[0].id }).toArray(async function (error, res) {
                        if (error) { client.error(error); };
                        if (res.length < 1) { return message.channel.send(client.src.comment(`No Valks were found under that ID.`)) };
                        let field = [], temp = [];
                        for (let valk of res) { temp.push(`${valk.name}: ${prefix}valk ${valk.id}`); }
                        field.push(`${result[0].about}\n`);
                        field.push(`${client.arrow} Name: ${result[0].name}`);
                        field.push(`${client.arrow} ID: ${result[0].id}`);
                        field.push(`${client.arrow} Age: ${result[0].age}`);
                        field.push(`${client.arrow} Height: ${result[0].height}`);
                        field.push(`${client.arrow} Weight: ${result[0].weight}`);
                        field.push(`${client.arrow} Birthday: ${result[0].bday}`);
                        field.push(`\nValks under this name:\n${client.src.code(temp.join(`\n`))}`);
                        message.channel.send(client.embed().setTitle(result[0].name).setDescription(field.join(`\n`)));
                        return client.log(message);
                    })
                })
        }
    }
}

module.exports.code = {
    title: "list",
    about: "List Charcter Types",
    usage: ["%P%list (SUB_LIST)"],
    alias: ["game", "hi3"],
}