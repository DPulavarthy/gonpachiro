let moment = require(`moment`);
require(`moment-duration-format`)(moment);

module.exports.run = async (client, message, args, prefix) => {
    let check = client.emojis.cache.get(client.emoji.check), cross = client.emojis.cache.get(client.emoji.cross), post = [];
    if (!args.join(` `)) {
        client.database.data.findOne({ case: module.exports.code.title }, async function (error, result) {
            if (error) { client.error(error); };
            if (result) { message.channel.send(client.src.comment(`There is an event currently running, if you want to edit the event type, \'${prefix}event help\'.`)); return client.log(message); };
            try {
                let msg = await message.author.send(client.embed().setTitle(`React with the "${check.toString()}" below to start the setup of an event.`));
                message.channel.send(client.src.comment(`Check your DMs`));
                await msg.react(check);
                const filter = (reaction, user) => [check.name].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
                const collector = msg.createReactionCollector(filter);
                collector.on('collect', async (reaction) => { if (reaction.emoji.name === check.name) { collector.stop(); return form(); }; });
                setTimeout(async () => { collector.stop(); }, 20 * 1000);
            } catch (error) { message.channel.send(client.src.comment(`DM message failed, ERROR: ${error}`)); return client.log(message); };
            client.log(message);
        })

        async function form() {
            let msg = await message.author.send(preset().setTitle(`What is the name of the boss in the event?`));
            let filter = collected => collected.author.id === message.author.id;
            collected = await get(msg, filter);
            if (collected.first().content.toUpperCase() === `CANCAL` || collected.first().content.toUpperCase() === `STOP`) { msg.edit(cancel()); return `CANCEL`; }
            msg = await message.author.send(preset().setTitle(`\'${collected.first().content}\' will be the name of the boss`));
            await msg.react(check);
            await msg.react(cross);
            filter = (reaction, user) => [check.name, cross.name].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
            let collector = msg.createReactionCollector(filter);

            collector.on('collect', async (reaction) => {
                if (reaction.emoji.name === check.name) {
                    post.push(collected.first().content);
                    msg.edit(client.src.comment(`Boss name set to \'${post[0]}\'`));
                    hp();
                };
                if (reaction.emoji.name === cross.name) { return form(); };
                collector.stop();
            });
            setTimeout(async () => { collector.stop(); }, 180 * 1000);

            async function hp() {
                let msg = await message.author.send(preset().setTitle(`What is the HP of the boss in the event?`));
                let filter = collected => collected.author.id === message.author.id;
                collected = await get(msg, filter);
                if (collected.first().content.toUpperCase() === `CANCAL` || collected.first().content.toUpperCase() === `STOP`) { msg.edit(cancel()); return `CANCEL`; }
                let num = parseInt(collected.first().content);
                if (!num || isNaN(num)) { msg.edit(`ERROR: ${num}`); return hp(); };
                msg = await message.author.send(preset().setTitle(`\'${num.toLocaleString()}\' will be the HP of the boss`));
                await msg.react(check);
                await msg.react(cross);
                filter = (reaction, user) => [check.name, cross.name].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
                let collector = msg.createReactionCollector(filter);

                collector.on('collect', async (reaction) => {
                    if (reaction.emoji.name === check.name) {
                        post.push(num);
                        msg.edit(client.src.comment(`Boss HP set to \'${post[1]}\'`));
                        about();
                    };
                    if (reaction.emoji.name === cross.name) { return hp(); };
                    collector.stop();
                });
                setTimeout(async () => { collector.stop(); }, 180 * 1000);
            }

            async function about() {
                let msg = await message.author.send(preset().setTitle(`What is the description of the boss in the event?`));
                let filter = collected => collected.author.id === message.author.id;
                collected = await get(msg, filter);
                let content = collected.first().content;
                if (content.toUpperCase() === `CANCAL` || content.toUpperCase() === `STOP`) { msg.edit(cancel()); return `CANCEL`; }
                if (content.toUpperCase() === `NONE`) { content = null; msg = await message.author.send(preset().setTitle(`No description for the boss.`)); }
                else { msg = await message.author.send(preset().setTitle(`\'${content}\' will be the description of the boss`)); }
                await msg.react(check);
                await msg.react(cross);
                filter = (reaction, user) => [check.name, cross.name].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
                let collector = msg.createReactionCollector(filter);

                collector.on('collect', async (reaction) => {
                    if (reaction.emoji.name === check.name) {
                        post.push(content);
                        msg.edit(client.src.comment(`Boss description set to \'${post[2]}\'`));
                        reward();
                    };
                    if (reaction.emoji.name === cross.name) { return about(); };
                    collector.stop();
                });
                setTimeout(async () => { collector.stop(); }, 180 * 1000);
            }

            async function reward() {
                let msg = await message.author.send(preset().setTitle(`What is the reward for battling the boss in the event?`));
                let filter = collected => collected.author.id === message.author.id;
                collected = await get(msg, filter);
                let content = collected.first().content;
                if (content.toUpperCase() === `CANCAL` || content.toUpperCase() === `STOP`) { msg.edit(cancel()); return `CANCEL`; }
                if (content.toUpperCase() === `NONE`) { content = null; msg = await message.author.send(preset().setTitle(`No reward for the boss.`)); }
                else { msg = await message.author.send(preset().setTitle(`\'${content}\' will be the reward for the boss`)); }
                await msg.react(check);
                await msg.react(cross);
                filter = (reaction, user) => [check.name, cross.name].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
                let collector = msg.createReactionCollector(filter);

                collector.on('collect', async (reaction) => {
                    if (reaction.emoji.name === check.name) {
                        post.push(content);
                        msg.edit(client.src.comment(`Boss reward set to \'${post[3]}\'`));
                        id();
                    };
                    if (reaction.emoji.name === cross.name) { return reward(); };
                    collector.stop();
                });
                setTimeout(async () => { collector.stop(); }, 180 * 1000);
            }

            async function id() {
                let msg = await message.author.send(preset().setTitle(`What is the reward id for battling the boss in the event?`));
                let filter = collected => collected.author.id === message.author.id;
                collected = await get(msg, filter);
                let content = collected.first().content;
                if (content.toUpperCase() === `CANCAL` || content.toUpperCase() === `STOP`) { msg.edit(cancel()); return `CANCEL`; }
                if (content.toUpperCase() === `NONE`) { content = null; msg = await message.author.send(preset().setTitle(`No reward id for the boss.`)); }
                else {
                    let emoji = client.emojis.cache.get(collected.first().content);
                    if (!emoji) { msg.edit(client.src.comment(`I couldn't find that emoji. Did you use the correct ID? ERROR: ${error}`)); return id(); };
                    msg = await message.author.send(preset().setTitle(`\'${content}\' will be the reward id for the boss`));
                }
                await msg.react(check);
                await msg.react(cross);
                filter = (reaction, user) => [check.name, cross.name].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
                let collector = msg.createReactionCollector(filter);

                collector.on('collect', async (reaction) => {
                    if (reaction.emoji.name === check.name) {
                        post.push(content);
                        msg.edit(client.src.comment(`Boss reward id set to \'${post[4]}\'`).setImage(client.emojis.cache.get(post[4]) ? client.emojis.cache.get(post[4]).url : null));
                        img();
                    };
                    if (reaction.emoji.name === cross.name) { return id(); };
                    collector.stop();
                });
                setTimeout(async () => { collector.stop(); }, 180 * 1000);
            }

            async function img() {
                let msg = await message.author.send(preset().setTitle(`What is the boss image link? Image link has to be an imgur link`).setImage(`https://i.imgur.com/PPwmuow.png`));
                let filter = collected => collected.author.id === message.author.id;
                collected = await get(msg, filter);
                if (collected.first().content.toUpperCase() === `CANCAL` || collected.first().content.toUpperCase() === `STOP`) { msg.edit(cancel()); return `CANCEL`; }
                msg = await message.author.send(preset().setTitle(`This will be the image for the boss, if the image does not show up it means your ID is incorrent`).setImage(`https://i.imgur.com/${collected.first().content}.png`));
                await msg.react(check);
                await msg.react(cross);
                filter = (reaction, user) => [check.name, cross.name].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
                let collector = msg.createReactionCollector(filter);

                collector.on('collect', async (reaction) => {
                    if (reaction.emoji.name === check.name) {
                        post.push(collected.first().content);
                        msg.edit(client.src.comment(`Boss image set`).setImage(`https://i.imgur.com/${post[5]}.png`));
                        final();
                    };
                    if (reaction.emoji.name === cross.name) { return img(); };
                    collector.stop();
                });
                setTimeout(async () => { collector.stop(); }, 180 * 1000);
            }

            async function final() {
                const embed = preset()
                    .setTitle(`New Event: ${post[0]} [${post[1].toLocaleString()} HP]`)
                    .setImage(`https://i.imgur.com/${post[5]}.png`)
                    .setDescription(`**About:** ${post[2]}\n**Reward:** ${post[3]} ${client.emojis.cache.get(post[4]) ? `(See Thumbnail)` : ``}`)
                    .setThumbnail(client.emojis.cache.get(post[4]) ? client.emojis.cache.get(post[4]).url : null)
                let msg = await message.author.send(embed);
                await msg.react(check);
                await msg.react(cross);
                let filter = (reaction, user) => [check.name, cross.name].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
                let collector = msg.createReactionCollector(filter);

                collector.on('collect', async (reaction) => {
                    if (reaction.emoji.name === check.name) {
                        update();
                        return msg.edit(client.src.comment(`Boss event started`));
                    };
                    if (reaction.emoji.name === cross.name) { return msg.edit(client.src.comment(`Event Cancelled.`)); };
                    collector.stop();
                });
                setTimeout(async () => { collector.stop(); }, 180 * 1000);
            }

            async function update() {
                let field = {
                    case: module.exports.code.title,
                    data: [{
                        id: post[0],
                        hp: post[1],
                        dmg: post[1],
                        img: post[5],
                        status: { id: true, about: post[2] },
                        reward: { id: post[4], about: post[3] },
                        played: [],
                        spawn: new Date().getTime(),
                        battle: false
                    }]
                }
                client.database.data.insertOne(field, function (error) { if (error) { client.error(error); }; });
                setTimeout(async () => {
                    client.database.data.findOne({ case: module.exports.code.title }, async function (error, result) {
                        if (error) { client.error(error); };
                        let field = [];
                        field.push(`${client.arrow} Name: ${result.data[0].id}`);
                        field.push(`${client.arrow} HP: ${result.data[0].hp}`);
                        field.push(`${client.arrow} Started: ${moment.duration(new Date().getTime() - result.data[0].spawn).format("w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds] ago")}`);
                        field.push(`${client.arrow} About: ${result.data[0].status.about}`);
                        field.push(`${client.arrow} Reward: ${result.data[0].reward.about} ${client.emojis.cache.get(result.data[0].reward.id) ? `(See Thumbnail)` : ``}`);
                        field.push(`${client.arrow} Type: ${result.case}`);
                        const embed = client.embed()
                            .setTitle(`New Boss!`)
                            .setThumbnail(client.emojis.cache.get(result.data[0].reward.id) ? client.emojis.cache.get(result.data[0].reward.id).url : null)
                            .setImage(`https://i.imgur.com/${result.data[0].img}.png`)
                            .setDescription(field.join(`\n`))
                        client.database.guilds.find().toArray(async function (error, body) {
                            if (error) { client.error(error); };
                            body.forEach(guild => { let channel = client.channels.cache.get(guild.log); if (channel) { channel.send(embed); }; });
                        })
                    })
                }, 1000);
            }

            function preset() { return client.embed().setFooter(`This promt will end in 3 minutes\nProvided by: ${client.user.tag}`); };
            function cancel() { return client.embed().setTitle(`Canceled!`); };
            async function get(msg, filter) { return await msg.channel.awaitMessages(filter, { max: 1, time: 180 * 1000, }).catch(() => { msg.edit(client.src.comment(`Timed out.`)); }); };
        }
    } else {
        switch (args[0].toUpperCase()) {
            case `HELP`:
                let field = [];
                field.push(`${prefix}${module.exports.code.title}`);
                field.push(`${prefix}${module.exports.code.title} help`);
                field.push(`${prefix}${module.exports.code.title} status [ON or OFF]`);
                message.channel.send(client.embed().setTitle(`Setup Help`).setDescription(client.src.code(field.join(`\n`))));
                client.log(message);
                break;
            case `STATUS`:
                if (!args[1]) {
                    client.database.data.findOne({ case: module.exports.code.title }, async function (error, result) {
                        if (error) { client.error(error); };
                        if (!result) { message.channel.send(client.src.comment(`No event currently avaliable.`)); return client.log(message); };
                        const embed = client.embed()
                            .setTitle(`Event: ${result.data[0].id} [${result.data[0].hp.toLocaleString()} HP]`)
                            .setImage(`https://i.imgur.com/${result.data[0].img}.png`)
                            .setDescription(`**About:** ${result.data[0].status.about}\n**Reward:** ${result.data[0].reward.about} ${client.emojis.cache.get(result.data[0].reward.id) ? `(See Thumbnail)` : ``}\n**Status:** ${result.data[0].status.id ? `Enabled` : `Disabled`}`)
                            .setThumbnail(client.emojis.cache.get(result.data[0].reward.id) ? client.emojis.cache.get(result.data[0].reward.id).url : null);
                        message.channel.send(embed);
                    });
                    return client.log(message);
                } else {
                    switch (args[1].toUpperCase()) {
                        case `ON`:
                            client.database.data.findOne({ case: module.exports.code.title }, async function (error, result) {
                                if (error) { client.error(error); };
                                if (!result) { message.channel.send(client.src.comment(`No event currently runnning, \'${prefix}setup\' to start an event.`)); return client.log(message); };
                                if (result.data[0].status.id) { message.channel.send(client.src.comment(`Event is already enabled.`)); return client.log(message); }
                                result.data[0].status.id = true;
                                let res = { $set: { data: result.data } };
                                client.database.data.updateOne({ case: module.exports.code.title }, res, function (error) { if (error) { client.src.error(error); } });
                                message.react(client.emojis.cache.get(client.emoji.check));
                            });
                            client.log(message);
                            break;
                        case `OFF`:
                            client.database.data.findOne({ case: module.exports.code.title }, async function (error, result) {
                                if (error) { client.error(error); };
                                if (!result) { message.channel.send(client.src.comment(`No event currently runnning, \'${prefix}setup\' to start an event.`)); return client.log(message); };
                                if (!result.data[0].status.id) { message.channel.send(client.src.comment(`Event is already disabled.`)); return client.log(message); }
                                result.data[0].status.id = false;
                                let res = { $set: { data: result.data } };
                                client.database.data.updateOne({ case: module.exports.code.title }, res, function (error) { if (error) { client.src.error(error); } });
                                message.react(client.emojis.cache.get(client.emoji.check));
                            });
                            client.log(message);
                            break;
                    }
                }
                client.log(message);
                break;
        }
    }
}

module.exports.code = {
    title: "event",
    about: "Setup event",
    usage: ["%P%event"],
    ranks: 8,
}