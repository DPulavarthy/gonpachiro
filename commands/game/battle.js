let Canvas = require('canvas'), Discord = require(`discord.js`), moment = require(`moment`);
require(`moment-duration-format`)(moment);

module.exports.run = async (client, message, args, prefix) => {
    let loading = await message.channel.send(client.src.loading());
    if (args.join(` `) && args.join(` `).toUpperCase() === `HELP`) {
        let field = [];
        field.push(`${prefix}${module.exports.code.title} [GUILD_ID]`);
        field.push(`${prefix}${module.exports.code.title} --> (Random guild will be picked)`);
        field.push(`${prefix}${module.exports.code.title} event`);
        field.push(`${prefix}${module.exports.code.title} help`);
        field.push(`${prefix}${module.exports.code.title} stats`);
        loading.edit(client.embed().setTitle(`Help for Battle`).setDescription(client.src.code(field.join(`\n`))));
        return client.log(message);
    } else if (args.join(` `) && args.join(` `).toUpperCase() === `EVENT`) {
        client.database.guilds.findOne({ id: message.guild.id }, async function (error, body) {
            if (error) { client.error(error); };
            if (!body) { loading.edit(client.src.comment(`${message.guild.name} does not have a game setup, run ${prefix}setup to start setting up ${client.user.username}.`)); return client.log(message); };
            client.database.data.findOne({ case: `event` }, async function (error, result) {
                if (error) { client.error(error); };
                if (!result) { loading.edit(client.src.comment(`No event currently avaliable.`)); return client.log(message); };
                if (!result.data[0].status.id) { loading.edit(client.src.comment(`The event is currently disabled. Please wait for the event to start again or end.`)); return client.log(message); };
                const embed = client.embed()
                    .setAuthor(`Event: ${result.data[0].id} [${result.data[0].hp.toLocaleString()} HP]`)
                    .setTitle(`${message.guild.name} VS ${result.data[0].id}`)
                    .setImage(`https://i.imgur.com/${result.data[0].img}.png`)
                    .setDescription(`**About:** ${result.data[0].status.about}\n**Reward:** ${result.data[0].reward.about} ${client.emojis.cache.get(result.data[0].reward.id) ? `(See Thumbnail)` : ``}\n**Status:** ${result.data[0].status.id ? `Enabled` : `Disabled`}`)
                    .setThumbnail(client.emojis.cache.get(result.data[0].reward.id) ? client.emojis.cache.get(result.data[0].reward.id).url : null);
                setTimeout(async () => { begin(embed); }, 1000);

                function begin(embed) {
                    loading.edit(embed);
                    let deploy = 0, total = 0, hold = result.data[0].dmg, health = result.data[0].dmg, history = [], toattack = false;
                    body.data.forEach(valk => { if (!valk.battle) { deploy++; total += valk.rank * 100; }; });
                    let life = total;
                    setTimeout(async () => { tostart(); }, 2 * 1000);

                    function tostart() { setTimeout(async () => { await battle() }, 2 * 1000); };

                    async function battle() {
                        if (life === 0 || health === 0) { return end(); }
                        else {

                            client.database.data.findOne({ case: `event` }, async function (error, result) {
                                if (error) { client.error(error); };
                                if (!result) { return loading.edit(client.embed().setTitle(`Boss Defeated!`)); }
                                toattack = toattack ? false : true;
                                if (toattack) {
                                    let move = await randattack(message.guild.name, result.data[0].id);
                                    health -= move[0];
                                    if (health < 0) { health = 0; }
                                    pushhistory(`${client.emojis.cache.get(client.emoji.attack).toString()} ${move[1]}`);
                                } else {
                                    let move = await randattack(result.data[0].id, message.guild.name);
                                    life -= move[0];
                                    if (life < 0) { life = 0; }
                                    pushhistory(`${client.emojis.cache.get(client.emoji.response).toString()} ${move[1]}`);
                                }
                                tostart();
                            })
                        }
                    }

                    async function end() {
                        let lost = life === 0 ? `${message.guild.name} has been defeated by the boss!` : `${result.data[0].id} has been defeated!`;
                        pushhistory(`${client.emojis.cache.get(client.emoji.dead).toString()} ${lost}`);
                        client.database.data.findOne({ case: `event` }, async function (error, result) {
                            if (error) { client.error(error); };
                            if (!result.data[0].played.includes(message.guild.id)) {
                                result.data[0].played.push(message.guild.id);
                                let res = { $set: { data: result.data } };
                                client.database.data.updateOne({ case: `event` }, res, function (error) { if (error) { client.error(error); } });
                            }
                            if (health === 0) {
                                if (result.data[0].reward.id) {
                                    result.data[0].played.forEach(async guild => {
                                        client.database.guilds.findOne({ id: guild }, async function (error, body) {
                                            if (error) { client.error(error); };
                                            body.badges.push(result.data[0].reward.id);
                                            let res = { $set: { badges: body.badges } };
                                            client.database.guilds.updateOne({ id: guild }, res, function (error) { if (error) { client.error(error); } });
                                        })
                                    })
                                }
                                let field = [];
                                field.push(`${client.arrow} Name: ${result.data[0].id}`);
                                field.push(`${client.arrow} Guilds Paticiated: ${result.data[0].played.length.toLocaleString()}`);
                                field.push(`${client.arrow} Alive for: ${moment.duration(new Date().getTime() - result.data[0].spawn).format("w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds]")}`);
                                field.push(`${client.arrow} About: ${result.data[0].status.about}`);
                                field.push(`${client.arrow} Reward: ${result.data[0].reward.about} ${client.emojis.cache.get(result.data[0].reward.id) ? `(See Thumbnail)` : ``}`);
                                field.push(`${client.arrow} Type: ${result.case}`);
                                const embed = client.embed()
                                    .setTitle(`Boss Defeated!`)
                                    .setThumbnail(client.emojis.cache.get(result.data[0].reward.id) ? client.emojis.cache.get(result.data[0].reward.id).url : null)
                                    .setImage(`https://i.imgur.com/${result.data[0].img}.png`)
                                    .setDescription(field.join(`\n`))
                                client.database.guilds.find().toArray(async function (error, body) {
                                    if (error) { client.error(error); };
                                    body.forEach(guild => { let channel = client.channels.cache.get(guild.log); if (channel) { channel.send(embed); }; });
                                })
                                client.src.db(`event`, null, true);
                            } else {
                                result.data[0].dmg -= (hold - health);
                                let res = { $set: { data: result.data } };
                                client.database.data.updateOne({ case: `event` }, res, function (error) { if (error) { client.error(error); } });
                                let field = [];
                                field.push(`${client.arrow} Name: ${result.data[0].id}`);
                                field.push(`${client.arrow} Guilds Paticiated: ${result.data[0].played.length.toLocaleString()}`);
                                field.push(`${client.arrow} Alive for: ${moment.duration(new Date().getTime() - result.data[0].spawn).format("w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds]")}`);
                                field.push(`${client.arrow} About: ${result.data[0].status.about}`);
                                field.push(`${client.arrow} Reward: ${result.data[0].reward.about} ${client.emojis.cache.get(result.data[0].reward.id) ? `(See Thumbnail)` : ``}`);
                                field.push(`${client.arrow} Type: ${result.case}`);
                                const embed = client.embed()
                                    .setTitle(`Boss Still Alive!`)
                                    .setThumbnail(client.emojis.cache.get(result.data[0].reward.id) ? client.emojis.cache.get(result.data[0].reward.id).url : null)
                                    .setImage(`https://i.imgur.com/${result.data[0].img}.png`)
                                    .setDescription(field.join(`\n`))
                                client.database.guilds.findOne({ id: message.guild.id }, async function (error, body) {
                                    if (error) { client.error(error); };
                                    let channel = client.channels.cache.get(body.log);
                                    if (channel) { channel.send(embed); };
                                })
                            }
                        })
                    }

                    async function pushhistory(input) {
                        let add = history.length < 3 ? true : false;
                        if (add) { history.push(input); }
                        else { history.shift(); history.push(input); };
                        await loading.edit(client.embed().setDescription(`${client.arrow} **${message.guild.name} [${deploy}/${body[0].data.length} valks deployed]:** ${life.toLocaleString()}/${total.toLocaleString()} HP\n${client.arrow} **${result[0].data[0].id}:** ${health.toLocaleString()}/${result[0].data[0].hp.toLocaleString()} HP left\n\n**History**\n${history.join(`\n`)}`));
                    }

                    async function randattack(user1, user2) {
                        let key = [Math.floor(Math.random() * 10) + 31, Math.floor(Math.random() * 10) + 41, Math.floor(Math.random() * 10) + 31, Math.floor(Math.random() * 10) + 41, Math.floor(Math.random() * 10) + 21], move = key[Math.floor(Math.random() * key.length)];
                        return [move, `${user1} used Attack #${(Math.floor(Math.random() * key.length)) + 1} on ${user2} for ${move} dmg.`];
                    }
                }
            })
        })
        return client.log(message);
    } else if (args.join(` `) && args.join(` `).toUpperCase() === `STATS`) {
        client.database.guilds.findOne({ id: message.guild.id }, async function (error, body) {
            if (error) { client.error(error); };
            if (!body) { loading.edit(client.src.comment(`${message.guild.name} does not have a game setup, run ${prefix}setup to start setting up ${client.user.username}.`)); return client.log(message); };
            client.database.guilds.find().toArray(async function (error, result) {
                if (error) { client.error(error); };
                let valks = result[0].data, list = [], raw = [];
                if (valks.length < 1) { loading.edit(client.src.comment(`${message.guild.name} does not have any valks yet  .`)); return client.log(message); };
                client.database.valks.findOne({ id: valks[0].case }, async function (error, res) {
                    if (error) { client.error(error); };
                    result.forEach(guild => {
                        let total = 0, deploy = 0, fixed = 0;
                        guild.data.forEach(valk => { fixed += valk.rank; });
                        raw.push({ id: guild.id, raw: fixed });
                        guild.data.forEach(valk => { if (!valk.battle) { deploy++; total += valk.rank; }; })
                        list.push({ id: guild.id, success: guild.attacked.length, rank: total, ready: deploy });
                    })
                    await valks.sort(function (a, b) { return b.rank - a.rank });
                    let type, dmg = 0, valk = result[0].data.findIndex(i => i.case === res.id);
                    res.data.forEach(attack => dmg += attack.dmg);
                    raw.sort(function (a, b) { return b.raw - a.raw });
                    list.sort(function (a, b) { return b.rank - a.rank });
                    switch (res.type.toUpperCase()) { case `BIO`: type = `${client.emojis.cache.get(client.emoji.bio).toString()} - Biologic`; break; case `MECH`: type = `${client.emojis.cache.get(client.emoji.mech).toString()} - Mecha`; break; case `PSY`: type = `${client.emojis.cache.get(client.emoji.psy).toString()} - Psychic`; break; case `PSY`: type = `${client.emojis.cache.get(client.emoji.qua).toString()} - Quantum`; break; default: type = `Unknown`; };
                    let field = [], rawloc = raw.findIndex(i => i.id === message.guild.id), listloc = list.findIndex(i => i.id === message.guild.id);
                    field.push(`${client.arrow} Raw Rank: ${raw[rawloc].raw.toLocaleString()}`);
                    field.push(`${client.arrow} Raw HP: ${(raw[rawloc].raw * 100).toLocaleString()}`);
                    field.push(`${client.arrow} Raw Global Rank: ${(rawloc + 1).toLocaleString()}`);
                    field.push(`${client.arrow} Current Rank: ${list[listloc].rank.toLocaleString()}`);
                    field.push(`${client.arrow} Current HP: ${(list[rawloc].rank * 100).toLocaleString()}`);
                    field.push(`${client.arrow} Current Global Rank: ${(listloc + 1).toLocaleString()}`);
                    field.push(`${client.arrow} Total Valks: ${result[0].data.length.toLocaleString()}`);
                    field.push(`${client.arrow} Valks ready for battle: ${list[listloc].ready.toLocaleString()}`);
                    field.push(`${client.arrow} Valks on battle CD: ${(result[0].data.length - list[listloc].ready).toLocaleString()}`);
                    field.push(`${client.arrow} Guilds attacked today: ${list[listloc].success.toLocaleString()} successful attack(s)`);
                    field.push(`${client.arrow} Gacha Cooldown: ${result[0].cooldown ? `Enabled` : `Disabled`}`);
                    field.push(`${client.arrow} Number of badges: ${body[0].badges.length}\n`);
                    field.push(`${client.arrow} Top Valk: ${res.name} [${valks[0].case}]`);
                    field.push(`${client.arrow} Valk Type: ${type}`);
                    field.push(`${client.arrow} Number of Attack types: ${res.data.length.toLocaleString()}`);
                    field.push(`${client.arrow} Valk Rank: ${result[0].data[valk].rank.toLocaleString()}`);
                    field.push(`${client.arrow} Valk HP: ${(result[0].data[valk].rank * 100).toLocaleString()}`);
                    field.push(`${client.arrow} Valk Points CD: ${result[0].data[valk].points ? `Enabled` : `Disabled`}`);
                    field.push(`${client.arrow} Valk Battle CD: ${result[0].data[valk].battle ? `Enabled` : `Disabled`}`);
                    field.push(`${client.arrow} Claimed: ${moment.duration(new Date().getTime() - body[0].data[valk].spawn).format("w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds] ago")}`);
                    field.push(`${client.arrow} Average attack DMG: ${((result[0].data[valk].rank * 100) / (dmg / res.data.length)).toFixed(0).toLocaleString()}`);
                    field.push(`\n\n**Badges**`);
                    const embed = client.embed()
                        .setTitle(`${message.guild.name} [${message.guild.id}]`)
                        .setDescription(field.join(`\n`))
                    let fields = [], emojis = { 0: [] }, counter = 0
                    body.badges.forEach((emoji, index) => {
                        if (emojis[counter].join('\n').length > 950) {
                            if (++index === body.badges.length) {
                                emojis[counter].push(`${client.emojis.cache.get(emoji).toString()}\`:${client.emojis.cache.get(emoji).name}:\``)
                            } else { counter++; emojis[counter] = []; }
                        } else { emojis[counter].push(`${client.emojis.cache.get(emoji).toString()}\`:${client.emojis.cache.get(emoji).name}:\``) }
                    })
                    if (emojis[0].join(``).length !== 0) {
                        Object.keys(emojis).forEach((col, index) => { if (index !== 0) { fields.push({ name: '\u200b', value: emojis[index].join("\n") }) } else { fields.push({ name: '\u200b', value: emojis[index].join("\n") }) } })
                    } else { fields.push({ name: '\u200b', value: '**None**' }); };
                    for await (const field of fields) {
                        embed.addField(field.name, field.value, true);
                    }
                    setTimeout(async () => { loading.edit(embed); }, 1000);
                });
            })
        })
        return client.log(message);
    } else {
        let attack = client.guilds.cache.get(args[0]), attacking = client.guilds.cache.get(args[0]);
        if (!args[0]) {
            client.database.guilds.find().toArray(async function (error, result) {
                if (error) { client.error(error); };
                let list = [], battle;
                result.forEach(guild => {
                    let total = 0;
                    guild.data.forEach(valk => { if (!valk.battle) { total += valk.rank; }; });
                    list.push({ id: guild.id, rank: total });
                    if (guild.id === message.guild.id) { battle = guild.attacked; };
                })
                if (list.length < 1) { loading.edit(client.src.comment(`No servers are ranked, auto battle disabled.`)); return client.log(message); };
                list.sort(function (a, b) { return b.rank - a.rank });
                let i = 0, next = true, index = 0, field = [];
                while (next) {
                    if (i > list.length) { loading.edit(`${message.guild.name} does not have a game setup, run \'${prefix}setup\' to begin the game.`); return client.log(message); };
                    if (list[i].id === message.guild.id) { index = i; next = false; };
                    i++;
                }
                if (index > 10) { for (let i = 10; i >= 0; i--) { let loc = index - i; if (list[loc].id !== message.guild.id && !battle.includes(list[loc].id)) { field.push(list[loc].id); }; }; }
                else { for (let i = 0; i < list.length; i++) { if (list[i].id !== message.guild.id && !battle.includes(list[i].id)) { field.push(list[i].id); }; }; };
                if (field.length < 1) { loading.edit(client.src.comment(`No guilds found for autobattle`)); return client.log(message); };
                let rand = field[Math.floor(Math.random() * field.length)];
                attack = client.guilds.cache.get(rand)
                attacking = client.guilds.cache.get(rand)
                startbattle();
            })
        } else { startbattle(); };
        function startbattle() {
            let data = [], guild = [];
            if (!attack) { loading.edit(client.src.comment(`I was unable to find a guild with that ID`)); return client.log(message); }
            if (attack.id === message.guild.id) { loading.edit(client.src.comment(`Your guild cannot battle itself!`)); return client.log(message); }
            client.database.guilds.findOne({ id: message.guild.id }, async function (error, result) {
                if (error) { client.error(error); };
                if (!result) { loading.edit(client.src.comment(`${message.guild.name} does not have a game setup, run ${prefix}setup to start setting up ${client.user.username}.`)); return client.log(message); };
                if (!attack) { loading.edit(client.src.comment(`I was not able to access that guild, input the guild ID and make sure ${client.user.username} is in the attacking guild to begin the attack.`)); return client.log(message); };
                if (result.attacked.includes(attack.id)) { loading.edit(client.src.comment(`You have already attacked this guild today, you cannot attack them until the reset at 12 AM CST.`)); return client.log(message); };
                let temp = [], other = [], save = [];
                result.data.filter(valk => { if (!valk.battle) { temp.push(valk) } });
                if (temp.length < 1) { loading.edit(client.src.comment(`You have no valks ready for deployment`)); return client.log(message); }
                temp.forEach(async valk => { save.push(valk); await client.database.valks.findOne({ id: valk.case }, async function (error, result) { if (error) { client.error(error); }; other.push(result); }); });
                other.length > 3 ? data.push(other.slice(0, 3)) : data.push(other);
                other.length > 3 ? guild.push(save.slice(0, 3)) : guild.push(save);
                let temp2 = [], other2 = [], save2 = [];
                client.database.guilds.findOne({ id: attack.id }, async function (error, result) {
                    if (error) { client.error(error); };
                    if (!result) { loading.edit(client.src.comment(`${attack.name} does not have a game setup, to battle them they have to setup ${client.user.username}.`)); return client.log(message); };
                    if (result.data.length < 1) { loading.edit(client.src.comment(`${attack.name} does not have any valks to battle with.`)); return client.log(message); };
                    result.data.filter(valk => { if (!valk.battle) { temp2.push(valk) } });
                    if (temp2.length < 1) { loading.edit(client.src.comment(`${attack.name} no valks ready for deployment`)); return client.log(message); }
                    temp2.forEach(async valk => { save2.push(valk); await client.database.valks.findOne({ id: valk.case }, async function (error, result) { if (error) { client.error(error); }; other2.push(result); }); });

                    other.length > 3 ? data.push(other2.slice(0, 3)) : data.push(other2);
                    other.length > 3 ? guild.push(save2.slice(0, 3)) : guild.push(save2);

                    let canvas = Canvas.createCanvas(960, 540), ctx = canvas.getContext('2d');
                    let image = await Canvas.loadImage(`https://i.imgur.com/4ND7EES.png`).catch(error => { client.error(error) });
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    image = await Canvas.loadImage(`https://i.imgur.com/Ml1eUdg.png`).catch(error => { client.error(error) });
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                    let title1 = message.guild.name.length > 13 ? `${message.guild.name.substring(0, 10)}...` : message.guild.name, title2 = attack.name.length > 13 ? `${attack.name.substring(0, 10)}...` : attack.name, guild1 = data[0], guild2 = data[1];
                    let total1 = 0, total2 = 0, names1 = [], names2 = [];
                    guild[0].forEach(valk => { total1 += (valk.rank * 100) })
                    guild[1].forEach(valk => { total2 += (valk.rank * 100) })
                    guild1.forEach(valk => valk.name.length > 18 ? names1.push(`${valk.name.substring(0, 15)}...`) : names1.push(valk.name));
                    guild2.forEach(valk => valk.name.length > 18 ? names2.push(`${valk.name.substring(0, 15)}...`) : names2.push(valk.name));

                    ctx.font = '10px sans-serif';
                    ctx.fillStyle = '#191919';
                    ctx.fillText(`${total1}HP`, 16, 11);
                    ctx.fillText(`${total2}HP`, canvas.width - 425 * 0.7 - 4, 11);
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillText(`${total1}HP`, 15, 10);
                    ctx.fillText(`${total2}HP`, canvas.width - 425 * 0.7 - 5, 10);


                    if (names1.length > 0) {
                        image = await Canvas.loadImage(`https://i.imgur.com/w8nlAA4.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, 5, 3 * (14 * 0.7) + 20, 425 * 0.7, 24);
                    }
                    if (names1.length > 1) {
                        image = await Canvas.loadImage(`https://i.imgur.com/w8nlAA4.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, 5, 5 * (14 * 0.7) + 25, 425 * 0.7, 24);
                    }
                    if (names1.length > 2) {
                        image = await Canvas.loadImage(`https://i.imgur.com/w8nlAA4.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, 5, 7 * (14 * 0.7) + 30, 425 * 0.7, 24);
                    }

                    if (names2.length > 0) {
                        image = await Canvas.loadImage(`https://i.imgur.com/w8nlAA4.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, canvas.width - 425 * 0.7 - 5, 3 * (14 * 0.7) + 20, 425 * 0.7, 24);
                    }
                    if (names2.length > 1) {
                        image = await Canvas.loadImage(`https://i.imgur.com/w8nlAA4.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, canvas.width - 425 * 0.7 - 5, 5 * (14 * 0.7) + 25, 425 * 0.7, 24);
                    }
                    if (names2.length > 2) {
                        image = await Canvas.loadImage(`https://i.imgur.com/w8nlAA4.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, canvas.width - 425 * 0.7 - 5, 7 * (14 * 0.7) + 30, 425 * 0.7, 24);
                    }

                    ctx.font = '20px sans-serif';
                    ctx.fillStyle = '#191919';
                    ctx.fillText(title1, 191, 2 * (14 * 0.7) + 21);
                    ctx.fillText(title2, 841, 2 * (14 * 0.7) + 21);
                    ctx.fillText(names1.join(`\n`), 31, 5 * (14 * 0.7) + 20);
                    ctx.fillText(names2.join(`\n`), canvas.width - 274, 5 * (14 * 0.7) + 20);
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillText(title1, 190, 2 * (14 * 0.7) + 20);
                    ctx.fillText(title2, 840, 2 * (14 * 0.7) + 20);
                    ctx.fillText(names1.join(`\n`), 30, 5 * (14 * 0.7) + 20);
                    ctx.fillText(names2.join(`\n`), canvas.width - 275, 5 * (14 * 0.7) + 20);

                    image = await Canvas.loadImage(`https://i.imgur.com/yyqBpgq.png`).catch(error => { client.error(error) });
                    ctx.drawImage(image, 15, canvas.height - 364 * 0.7 - 1, 364 * 0.7, 364 * 0.7);
                    ctx.drawImage(image, canvas.width - 364 * 0.7 - 15, canvas.height - 364 * 0.7 - 1, 364 * 0.7, 364 * 0.7);
                    image = await Canvas.loadImage(`https://i.imgur.com/CO6A6F8.png`).catch(error => { client.error(error) });
                    ctx.drawImage(image, 10, 14 * 0.7, 425 * 0.7, 14 * 0.7);
                    ctx.drawImage(image, canvas.width - 425 * 0.7 - 10, 14 * 0.7, 425 * 0.7, 14 * 0.7);
                    image = await Canvas.loadImage(`https://i.imgur.com/${guild1[0].img}.png`).catch(error => { client.error(error) });
                    ctx.drawImage(image, 0, canvas.height - 364 * 0.7, 400 * 0.7, 364 * 0.7);
                    image = await Canvas.loadImage(`https://i.imgur.com/${guild2[0].img}.png`).catch(error => { client.error(error) });
                    ctx.drawImage(image, canvas.width - (400 * 0.7), canvas.height - 364 * 0.7, 400 * 0.7, 364 * 0.7);

                    if (guild1[1]) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(15 + (104 * 0.7) / 2, ((canvas.height / 2) - 40) + (104 * 0.7) / 2, (104 * 0.7) / 2, 0, Math.PI * 2, true);
                        ctx.closePath();
                        ctx.clip();
                        image = await Canvas.loadImage(`https://i.imgur.com/yyqBpgq.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, 15, (canvas.height / 2) - 40, 104 * 0.7, 104 * 0.7);
                        image = await Canvas.loadImage(`https://i.imgur.com/${guild1[1].icon}.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, 10, (canvas.height / 2) - 40, 118 * 0.7, 104 * 0.7);
                        ctx.restore();
                        image = await Canvas.loadImage(`https://i.imgur.com/yCOB97D.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, 10, canvas.height / 2 - 45, 104 * 0.7 + 10, 104 * 0.7 + 10);
                    }

                    if (guild1[2]) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(15 + (104 * 0.7) / 2, 150 + (104 * 0.7) / 2, (104 * 0.7) / 2, 0, Math.PI * 2, true);
                        ctx.closePath();
                        ctx.clip();
                        image = await Canvas.loadImage(`https://i.imgur.com/yyqBpgq.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, 15, 150, 104 * 0.7, 104 * 0.7);
                        image = await Canvas.loadImage(`https://i.imgur.com/${guild1[2].icon}.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, 10, 150, 118 * 0.7, 104 * 0.7);
                        ctx.restore();
                    }

                    if (guild2[1]) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(canvas.width - (104 * 0.7) - 15 + (104 * 0.7) / 2, ((canvas.height / 2) - 40) + (104 * 0.7) / 2, (104 * 0.7) / 2, 0, Math.PI * 2, true);
                        ctx.closePath();
                        ctx.clip();
                        image = await Canvas.loadImage(`https://i.imgur.com/yyqBpgq.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, canvas.width - (104 * 0.7) - 15, canvas.height / 2 - 40, 104 * 0.7, 104 * 0.7);
                        image = await Canvas.loadImage(`https://i.imgur.com/${guild2[1].icon}.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, canvas.width - (104 * 0.7) - 20, canvas.height / 2 - 40, 118 * 0.7, 104 * 0.7);
                        ctx.restore();
                        image = await Canvas.loadImage(`https://i.imgur.com/yCOB97D.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, canvas.width - (104 * 0.7) - 20, canvas.height / 2 - 45, 104 * 0.7 + 10, 104 * 0.7 + 10);
                    }

                    if (guild2[2]) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(canvas.width - (104 * 0.7) - 15 + (104 * 0.7) / 2, 150 + (104 * 0.7) / 2, (104 * 0.7) / 2, 0, Math.PI * 2, true);
                        ctx.closePath();
                        ctx.clip();
                        image = await Canvas.loadImage(`https://i.imgur.com/yyqBpgq.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, canvas.width - (104 * 0.7) - 15, 150, 104 * 0.7, 104 * 0.7);
                        image = await Canvas.loadImage(`https://i.imgur.com/${guild2[2].icon}.png`).catch(error => { client.error(error) });
                        ctx.drawImage(image, canvas.width - (104 * 0.7) - 20, 150, 118 * 0.7, 104 * 0.7);
                        ctx.restore();
                    }

                    image = await Canvas.loadImage(`https://i.imgur.com/yyqBpgq.png`).catch(error => { client.error(error) });
                    ctx.drawImage(image, (canvas.width / 2) - 150, 14 * 0.7, 104 * 0.7, 104 * 0.7);
                    ctx.drawImage(image, (canvas.width / 2) + 75, 14 * 0.7, 104 * 0.7, 104 * 0.7);

                    ctx.save();
                    ctx.beginPath();
                    ctx.arc((canvas.width / 2) - 150 + (104 * 0.7) / 2, 14 * 0.7 + (104 * 0.7) / 2, (104 * 0.7) / 2, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    image = await Canvas.loadImage(message.guild.iconURL({ format: "png", dynamic: true, size: 1024 })).catch(error => { client.error(error) });
                    ctx.drawImage(image, (canvas.width / 2) - 150, 14 * 0.7, 104 * 0.7, 104 * 0.7);
                    ctx.restore();
                    image = await Canvas.loadImage(`https://i.imgur.com/mbhrHoo.png`).catch(error => { client.error(error) });
                    ctx.drawImage(image, (canvas.width / 2) - 150 - 5, 14 * 0.7 - 5, 104 * 0.7 + 10, 104 * 0.7 + 10);

                    ctx.save();
                    ctx.beginPath();
                    ctx.arc((canvas.width / 2) + 75 + (104 * 0.7) / 2, 14 * 0.7 + (104 * 0.7) / 2, (104 * 0.7) / 2, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    image = await Canvas.loadImage(attacking.iconURL({ format: "png", dynamic: true, size: 1024 })).catch(error => { client.error(error) });
                    ctx.drawImage(image, (canvas.width / 2) + 75, 14 * 0.7, 104 * 0.7, 104 * 0.7);
                    ctx.restore();
                    image = await Canvas.loadImage(`https://i.imgur.com/mbhrHoo.png`).catch(error => { client.error(error) });
                    ctx.drawImage(image, (canvas.width / 2) + 75 - 5, 14 * 0.7 - 5, 104 * 0.7 + 10, 104 * 0.7 + 10);

                    let attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'battle.png');
                    loading.delete();
                    let load = await message.channel.send(attachment)
                    load.edit(client.src.embed(`Battle Started!`))
                    let embed = await load.edit(client.src.embed().setTitle(`${message.guild.name} VS ${attacking.name}`)), life1 = [], life2 = [];
                    guild[0].forEach(valk => { life1.push(valk.rank * 100); })
                    guild[1].forEach(valk => { life2.push(valk.rank * 100); })
                    let max1 = life1.reduce((a, b) => a + b, 0), max2 = life2.reduce((a, b) => a + b, 0);
                    let evasion = false, history = [];
                    let index = [0, 0];
                    attack = true;

                    start();

                    function start() { setTimeout(async () => { await play() }, 2 * 1000); };

                    async function play() {
                        if (max1 === 0 || max2 === 0) { return winner(); }
                        else {
                            attack = attack ? false : true;
                            if (attack) {
                                let move = await getAttack(attack);
                                if (evasion) { evasion = false; addHistory(`${client.emojis.cache.get(client.emoji.end).toString()} ${move[1]}`); }
                                else {
                                    max2 -= move[0];
                                    life2[index[1]] -= move[0];
                                    if (max2 < 0) { max2 = 0; }
                                    addHistory(`${client.emojis.cache.get(client.emoji.attack).toString()} ${move[1]}`);
                                }
                            } else {
                                let move = await getAttack(attack);
                                if (evasion) { evasion = false; addHistory(`${client.emojis.cache.get(client.emoji.end).toString()} ${move[1]}`); }
                                else {
                                    max1 -= move[0];
                                    life1[index[0]] -= move[0];
                                    if (max1 < 0) { max1 = 0; }
                                    addHistory(`${client.emojis.cache.get(client.emoji.response).toString()} ${move[1]}`);
                                }
                            }
                            start();
                        }
                    }

                    async function winner() {
                        let first = false;
                        life1.forEach(valk => { if (valk > 0) { return first = true; } });
                        addHistory(`${client.emojis.cache.get(client.emoji.winner).toString()} __*${first ? message.guild.name : attacking.name}*__ has won the battle!`);
                        update(first);
                    }

                    async function addHistory(input) {
                        if (history.length < 3) { history.push(input); }
                        else { history.shift(); history.push(input); };
                        let field = [`**${message.guild.name}: ${max1}/${total1}**`];
                        for (let i = 0; i < guild[0].length; i++) { field.push(`${client.arrow} ${guild1[i].name}: ${life1[i] <= 0 ? client.emojis.cache.get(client.emoji.dead) : `${life1[i]}/${guild[0][i].rank * 100}`}`) };
                        field.push(`\n**${attacking.name}: ${max2}/${total2}**`);
                        for (let i = 0; i < guild[1].length; i++) { field.push(`${client.arrow} ${guild2[i].name}: ${life2[i] <= 0 ? client.emojis.cache.get(client.emoji.dead) : `${life2[i]}/${guild[1][i].rank * 100}`}`) };
                        await embed.edit(client.embed().setDescription(`${field.join(`\n`)}\n\n**History**\n${history.join(`\n`)}`));
                    }

                    async function getAttack(turn) {
                        let server = turn ? guild1[index[0]] : guild2[index[1]];
                        let oppose = turn ? guild2[index[1]] : guild1[index[0]];
                        let attack = server.data[Math.floor(Math.random() * server.data.length)];
                        let rank = turn ? guild[0][index[0]].rank * 100 : guild[1][index[1]].rank * 100;
                        let original = [`{A}`, `{B}`, `{C}`];
                        let move = attack.data;
                        let data = (rank / attack.dmg).toFixed(0);
                        if (attack.dmg === 0) { evasion = true; }
                        let replace = [server.name, oppose.name, data];
                        for (let i = 0; i < original.length; i++) { while (move.includes(original[i])) { let loc = move.indexOf(original[i]); move = `${move.substring(0, loc)}__*${replace[i]}*__${move.substring(loc + original[i].length)}`; }; };
                        let life = turn ? life1[index[0]] : life2[index[1]];
                        let dmg = life - data
                        if (dmg < 0) { if (!evasion) { move += ` [${dmg}]`; } };
                        return [data, move];
                    }

                    function update(first) {
                        let field = [`**${message.guild.name}: [${max1}/${total1}]**`];
                        for (let i = 0; i < guild[0].length; i++) {
                            field.push(`${guild1[i].name}: Rank [${guild[0][i].rank}] HP [${life1[i] < 0 ? client.emojis.cache.get(client.emoji.dead).toString() : `${life1[i]}/${guild[0][i].rank * 100}`}]`);
                        }
                        field.push(`\n**${attacking.name}: [${max2}/${total2}]**`);
                        for (let i = 0; i < guild[1].length; i++) {
                            field.push(`${guild2[i].name}: Rank [${guild[1][i].rank}] HP [${life2[i] < 0 ? client.emojis.cache.get(client.emoji.dead).toString() : `${life2[i]}/${guild[1][i].rank * 100}`}]`);
                        }
                        field.push(`\n${client.emojis.cache.get(client.emoji.winner).toString()} __*${first ? message.guild.name : attacking.name}*__ won the battle!`)
                        const embed = client.embed().setTitle(`BATTLE LOG`).setDescription(field.join(`\n`));
                        if (first) {
                            let double = [];
                            guild[0].forEach(valk => { double.push(valk.case); });
                            client.database.guilds.findOne({ id: message.guild.id }, async function (error, result) {
                                if (error) { client.error(error); };
                                result.attacked.push(attacking.id);
                                result.data.forEach(valk => { if (double.includes(valk.case)) { valk.battle = true; valk.rank += 2; } else { valk.rank++; }; });
                                let res = { $set: { attacked: result.attacked, data: result.data } };
                                client.database.guilds.updateOne({ id: message.guild.id }, res, function (error) { if (error) { client.error(error); } });
                            })
                        }
                        client.database.guilds.findOne({ id: message.guild.id }, async function (error, result) {
                            if (error) { client.error(error); };
                            let channel = client.channels.cache.get(result.log);
                            if (channel) { channel.send({ files: [attachment], embed: embed }); };
                        })
                        client.database.guilds.findOne({ id: attacking.id }, async function (error, result) {
                            if (error) { client.error(error); };
                            let channel = client.channels.cache.get(result.log);
                            if (channel) { channel.send({ files: [attachment], embed: embed }); };
                        })
                        return client.log(message);
                    }
                })
            })
        }
    }
}

module.exports.code = {
    title: "battle",
    about: "Use valks to battle other guilds",
    usage: ["%P%battle [GUILD_ID]", "%P%battle stats", "%P%battle help", "%P%battle event", "%P%battle"],
    alias: ["attack"],
}