let moment = require(`moment`);
require(`moment-duration-format`)(moment);

module.exports.run = async (client, message) => {
    client.database.guilds.findOne({ id: message.guild.id }, async function (error, result) {
        if (error) { client.error(error); };
        if (!result) { message.channel.send(client.src.comment(`${message.guild.name} does not have a game setup, run ${client.prefix}setup to start setting up ${client.user.username}.`)); return client.log(message); };
        if (result.cooldown) { message.channel.send(client.src.comment(`${message.guild.name} is currently in cooldown, wait until 12AM CST on Sunday for the cooldown to reset.`)); return client.log(message); };
        client.database.valks.find().toArray(async function (error, list) {
            if (error) { client.error(error); };
            let temp = [], field = [];
            result.data.forEach(character => temp.push(character.case));
            list = list.filter(valk => !temp.includes(valk.id));
            if (list.length < 1) { message.channel.send(client.src.comment(`${message.guild.name} has claimed all valks, no new valks left.`)); return client.log(message); };
            let rand = Math.floor(Math.random() * list.length);
            result.data.push({ case: list[rand].id, rank: 1, points: false, battle: false, spawn: new Date().getTime() });
            let res = { $set: { cooldown: true, data: result.data } };
            client.database.guilds.updateOne({ id: message.guild.id }, res, function (error) { if (error) { client.src.error(error); } });
            let preload = await message.channel.send(client.embed().setTitle(`Loading...`));
            preload.edit(client.embed().setTitle(`Gathering Resources...`));
            setTimeout(async () => { preload.edit(client.embed().setTitle(`Spending Crystals...`)); }, 3000);
            setTimeout(async () => { preload.edit(client.embed().setTitle(`Randomizing Valks...`)); }, 6000);
            setTimeout(async () => { preload.edit(client.embed().setTitle(`New Valk Time!!!`).setImage(`https://media.giphy.com/media/jpKePSdlU5J8PrDjeQ/giphy.gif`)); }, 9000);
            client.database.heads.findOne({ id: list[rand].head }, async function (error, res) {
                if (error) { client.error(error); };
                let type, spawn, claim = [];
                if (result) { result.data.filter(valk => { if (valk.case === list[rand].id) { claim = [valk.rank, valk.points, valk.battle, valk.spawn] }; }); };
                spawn = claim.length > 0 ? `${moment.duration(new Date().getTime() - claim[3]).format("w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds] ago")}` : `N/A`;
                switch (list[rand].type.toUpperCase()) { case `BIO`: type = `${client.emojis.cache.get(client.emoji.bio).toString()} - Biologic`; break; case `MECH`: type = `${client.emojis.cache.get(client.emoji.mech).toString()} - Mecha`; break; case `PSY`: type = `${client.emojis.cache.get(client.emoji.psy).toString()} - Psychic`; break; case `PSY`: type = `${client.emojis.cache.get(client.emoji.qua).toString()} - Quantum`; break; default: type = `Unknown`; };
                field.push(`${client.arrow} Name: ${list[rand].name}`);
                field.push(`${client.arrow} ID: ${list[rand].id}`);
                field.push(`${client.arrow} Type: ${type}`);
                field.push(`${client.arrow} Age: ${res.age}`);
                field.push(`${client.arrow} Height: ${res.height}`);
                field.push(`${client.arrow} Weight: ${res.weight}`);
                field.push(`${client.arrow} Birthday: ${res.bday}`);
                field.push(`${client.arrow} Claimed By Server: ${claim.length > 0 ? `Yes` : `No`}`);
                field.push(`${client.arrow} Rank: ${claim.length > 0 ? claim[0] : `N/A`}`);
                field.push(`${client.arrow} Points Cooldown: ${claim.length > 0 ? (claim[1] ? `On` : `Off`) : `N/A`}`);
                field.push(`${client.arrow} Battle Cooldown: ${claim.length > 0 ? (claim[2] ? `On` : `Off`) : `N/A`}`);
                field.push(`${client.arrow} Claimed: ${spawn}`);
                client.database.valks.findOne({ head: list[rand].head }, async function (error, res) {
                    if (error) { client.error(error); };
                    let other = [];
                    res.filter(valk => { if (valk.id !== list[rand].id) { other.push(`${valk.name}: ${client.prefix}valk ${valk.id}`) }; });
                    field.push(`\nOther valks: ${client.src.code(other.join(`\n`))}`);
                    setTimeout(async () => { preload.edit(client.embed().setAuthor(`New Valk: ${list[rand].name}!!`, `https://i.imgur.com/${list[rand].icon}.png`).setDescription(field.join(`\n`)).setImage(`https://i.imgur.com/${list[rand].img}.png`)) }, 15000);
                })
                return client.log(message);
            })
        })
    })
}

module.exports.code = {
    title: "gacha",
    about: "Pull a character",
    usage: ["%P%gacha"],
}