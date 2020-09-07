module.exports.run = async (client, message, args, prefix) => {
    client.database.config.find({ case: `data` }).toArray(async function (error, result) {
        if (error) { client.error(error); };
        let developer = result[0].data.find(rank => rank.case.toUpperCase() === `DEVELOPERS`)
        if (!message.guild.members.cache.get(message.author.id).hasPermission(`ADMINISTRATOR`) && !developer.data.includes(message.author.id)) { message.channel.send(client.src.comment(`You do not have the following permission: ADMINISTRATOR`)); return client.log(message); };
        if (!args.join(` `)) {
            client.database.guilds.find({ id: message.guild.id }).toArray(async function (error, result) {
                if (error) { client.error(error); };
                if (result.length > 0) { message.channel.send(client.src.comment(`${message.guild.name} has already setup ${client.user.username}, \'${prefix}setup help\' for more information.`)); return client.log(message); };
                let check = client.emojis.cache.get(client.emoji.check), cross = client.emojis.cache.get(client.emoji.cross);
                try {
                    let msg = await message.author.send(client.embed().setTitle(`React with the "${check.toString()}" below to start the setup of ${client.user.username}.`));
                    message.channel.send(client.src.comment(`Check your DMs`));
                    await msg.react(check);
                    const filter = (reaction, user) => [check.name].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
                    const collector = msg.createReactionCollector(filter);
                    collector.on('collect', async (reaction) => { if (reaction.emoji.name === check.name) { collector.stop(); return form(); }; });
                    setTimeout(async () => { collector.stop(); }, 20 * 1000);
                }
                catch (error) { message.channel.send(client.src.comment(`DM message failed, ERROR: ${error}`)); return client.log(message); };

                async function form() {
                    let post = [], embed = preset()
                        .setTitle(`Would you like Nitro Mockup enabeled?`)
                        .setDescription(`Nitro Mockup Allows users without nitro to use ${client.user.username} for posting emojis that are external to the server or animated. \`${prefix}ael\` for more information. React with the \"${check.toString()}\" to enable, or \"${cross.toString()}\" to keep it disabled.\n\n**Example**`)
                        .setImage(`https://i.imgur.com/NVDspuU.gif`)
                    let msg = await message.author.send(embed);

                    await msg.react(check);
                    await msg.react(cross);
                    let filter = (reaction, user) => [check.name, cross.name].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
                    let collector = msg.createReactionCollector(filter);

                    collector.on('collect', async (reaction) => {
                        collector.stop();
                        if (reaction.emoji.name === check.name) { post.push(true); };
                        if (reaction.emoji.name === cross.name) { post.push(false); };
                        let res = await askprefix();
                        while (!res) { res = await askprefix(); if (res === `CANCEL`) return; }
                    });
                    setTimeout(async () => { collector.stop(); }, 180 * 1000);

                    async function askprefix() {
                        let msg = await message.author.send(preset().setTitle(`Custom Prefix`).setDescription(`Set a 2 character prefix for your server Do not use \`\\\` as part of your prefix. Type \`None\` or \`Default\` to use ${client.user.username}'s default prefix [${prefix}]`));
                        let filter = collected => collected.author.id === message.author.id;
                        collected = await get(msg, filter);
                        if (collected.first().content.toUpperCase() === `CANCAL` || collected.first().content.toUpperCase() === `STOP`) { msg.edit(cancel()); return `CANCEL`; }
                        if (collected.first().content.toUpperCase() === `NONE` || collected.first().content.toUpperCase() === `DEFAULT`) { post.push(prefix); msg.edit(client.src.comment(`Default Prefix Set.`)); next(); return true; }
                        if (collected.first().content.length !== 2) { msg.edit(client.src.comment(`Prefix must be only 2 characters long, try again.`)); return false; }
                        if (collected.first().content.toUpperCase().includes(`\\`)) { msg.edit(client.src.comment(`Prefix must not contain a \\, try again.`)); return false; }
                        let embed = preset()
                            .setTitle(`Prefix will be set to ${collected.first().content.toLowerCase()}`)
                            .setDescription(`The server prefix will be set to \`${collected.first().content.toLowerCase()}\`, if you are satisfied with the prefix react with the \"${check.toString()}\", react with the \"${cross.toString()}\" if you would like to choose another prefix.`)
                        msg = await message.author.send(embed);
                        collect();
                        return true;
                        async function collect() {
                            await msg.react(check);
                            await msg.react(cross);
                            filter = (reaction, user) => [check.name, cross.name].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
                            let collector = msg.createReactionCollector(filter);

                            collector.on('collect', async (reaction) => {
                                if (reaction.emoji.name === check.name) {
                                    post.push(collected.first().content);
                                    msg.edit(client.src.comment(`Commands will now use \'${collected.first().content.toLowerCase()}\', EX: \'${collected.first().content.toLowerCase()}help\'`));
                                    next();
                                    return true;
                                };
                                if (reaction.emoji.name === cross.name) { return askprefix(); };
                                collector.stop();
                            });
                            setTimeout(async () => { collector.stop(); }, 180 * 1000);
                        }

                        async function next() { let res = await asklog(); while (!res) { res = await asklog(); if (res === `CANCEL`) return; }; };
                    }

                    async function asklog() {
                        let embed = preset()
                            .setTitle(`Would you like to have a channel for logging ${client.user.username}'s command usage?`)
                            .setDescription(`To get a channel's ID run ${prefix}channel in the logging channel and post the ID here. ${client.user.username} will log all successful commands in the log channel. As well as gacha rolls and moderation commands log.\n${client.emojis.cache.get(client.emoji.warning).toString()} **WITHOUT THIS CHANNEL YOU WILL NOT KNOW WHEN SOMEONE ATTACKS YOUR GUILD IN THE GAME!!!!** ${client.emojis.cache.get(client.emoji.warning).toString()}`)
                        let msg = await message.author.send(embed);
                        let filter = collected => collected.author.id === message.author.id;
                        collected = await get(msg, filter);
                        if (collected.first().content.toUpperCase() === `CANCAL` || collected.first().content.toUpperCase() === `STOP`) { msg.edit(cancel()); return `CANCEL`; }
                        let channel = client.channels.cache.get(collected.first().content);
                        if (!channel) { msg.edit(client.src.comment(`I couldn't find that channel. Did you use the correct ID? ERROR: ${error}`)); return false; };
                        if (channel.guild.id !== message.guild.id) { msg.edit(client.src.comment(`That channel was not found in ${message.guild.name}`)); return false; };
                        embed = preset()
                            .setTitle(`Log Channel will be set to ${channel.name}`)
                            .setDescription(`The server log channel for commands, gacha, and moderation will be ${channel.toString()}, if you are satisfied with the channel react with the \"${check.toString()}\", react with the \"${cross.toString()}\" if you would like to choose another channel.`)
                        msg = await message.author.send(embed);
                        collect();
                        return true;
                        async function collect() {
                            await msg.react(check);
                            await msg.react(cross);
                            filter = (reaction, user) => [check.name, cross.name].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
                            let collector = msg.createReactionCollector(filter);

                            collector.on('collect', async (reaction) => {
                                if (reaction.emoji.name === check.name) {
                                    post.push(collected.first().content);
                                    msg.edit(client.src.comment(`Logs will now go to #${channel.name}`));
                                    final();
                                    return true;
                                };
                                if (reaction.emoji.name === cross.name) { return false; };
                                collector.stop();
                            });
                            setTimeout(async () => { collector.stop(); }, 180 * 1000);
                        }
                    }

                    async function final() {
                        let field = [];
                        field.push(`${client.arrow} Nitro Mockup: ${post[0] ? `Enabled` : `Disabled`}`);
                        field.push(`${client.arrow} Prefix: ${post[1] ? post[1] : `Default [${prefix}]`}`);
                        field.push(`${client.arrow} Log Channel: ${post[2] ? client.channels.cache.get(post[2]).toString() : `Disabled`}`);
                        let embed = preset()
                            .setTitle(`Overview`)
                            .setDescription(`If all the data is correct, reach with the \"${check.toString()}\" to finish setting up or react with the \"${cross.toString()}\" to cancel the setup.\n\n${field.join(`\n`)}`)
                        let msg = await message.author.send(embed);

                        await msg.react(check);
                        await msg.react(cross);
                        filter = (reaction, user) => [check.name, cross.name].includes(reaction.emoji.name) && (message.author.id === user.id) && (client.user.id !== user.id);
                        collector = msg.createReactionCollector(filter);

                        collector.on('collect', async (reaction) => {
                            if (reaction.emoji.name === check.name) { update(); msg.edit(client.src.comment(`Finished setting up profile for ${message.guild.name}.`)); };
                            if (reaction.emoji.name === cross.name) { msg.edit(client.src.comment(`Use ${prefix}setup to setup up profile for ${message.guild.name} whenever needed.`)); };
                            collector.stop();
                        });
                        setTimeout(async () => { collector.stop(); }, 180 * 1000);
                    }

                    async function update() {
                        let field = { id: message.guild.id, nitro: post[0], cooldown: false, log: post[2], prefix: post[1], count: 0, badges: [], attacked: [], data: [] };
                        client.database.guilds.insertOne(field, function (error) { if (error) { client.error(error); }; });
                        let channel = client.channels.cache.get(post[2]);
                        if (channel) {
                            const embed = client.embed()
                                .setTitle(`Setup Complete! Now what?`)
                                .setDescription(`Here is a list of some of the thing to remember while using ${client.user.username}.`)
                                .addField(`Gacha/Valkyries`, `The gacha is a command that is reset every Sunday at 12AM CST, it allows your guild to claim a new character. You can upgrade the character once per day. To upgrade multiple times you can battle other servers. You can battle by leaderbords(\`${prefix}battle stats\`) or ranks(\`${prefix}battle rank\`) just run the command \`${prefix}battle\` and give it the guild ID that you want to attack.`, false)
                                .addField(`Resets`, `**${client.user.username.toUpperCase()} WILL RESET ALL DATA MEANING LOSS OF GACHA, NITRO MOCKUP, AND LOGGING, IF THE FOLLOWING OCCURS..**\n${client.user.username} leaves the server (by getting kicked/banned/ or left by request of bot owners)\n Using the \`${prefix}delete\` command that remove guild information from ${client.user.username}'s database.`, false)
                                .addField(`Support`, `If you have any issues or problems you can ask in the [support server](${client.util.link.support}). If you trigger any command or event that deletes data, it will be deleted instantly and **CANNOT** be restored.`, false)
                                .addField(`Nitro`, `The nitro mockup allows users without nitro to use animated or external emojis. You can view this server's emoji list by using the \`${prefix}ael\` command, if not needed or not wanted you can disable this feature by running \`${prefix}setup nitro off\``, false)
                                .addField(`Other`, `The approved users of ${client.user.username} have the option to make the bot leave any server deemed unsafe, such as using ${client.user.username} to search for NSFW content when not intended. The author of those messages also has a chance of being blacklisted from using ${client.user.username}'s commands.`, false)
                                .addField(`Donate`, `Commands take a lot of time to create and maintain especially by one person, [Donating to ${client.user.username}](${client.util.link.donate}) is one of the best ways to support us. Once you donate and join the [support server](${client.util.link.support}), we can give you a higher role on ${client.user.username} and gives access to special commands and allows you to show your support on the \`${prefix}jonin?\` command.`, false)
                                .setImage(`https://i.imgur.com/Nr6yzUR.jpg`)
                            let first = await channel.send(embed);
                            first.pin();
                        }
                    }

                    function preset() { return client.embed().setFooter(`This promt will end in 3 minutes\nProvided by: ${client.user.tag}`); };
                    function cancel() { return client.embed().setTitle(`Canceled!`); };
                    async function get(msg, filter) { return await msg.channel.awaitMessages(filter, { max: 1, time: 180 * 1000, }).catch(() => { msg.edit(client.src.comment(`Timed out.`)); }); };
                }
            })
        } else {
            switch (args[0].toUpperCase()) {
                case `HELP`:
                    let field = [];
                    field.push(`${prefix}${module.exports.code.title}`);
                    field.push(`${prefix}${module.exports.code.title} help`);
                    field.push(`${prefix}${module.exports.code.title} prefix [PREFIX]`);
                    field.push(`${prefix}${module.exports.code.title} channel [CHANNEL_ID] <log>`);
                    field.push(`${prefix}${module.exports.code.title} nitro [ON/TRUE/ENABLED or OFF/FALSE/DISABLED]`);
                    message.channel.send(client.embed().setTitle(`Setup Help`).setDescription(client.src.code(field.join(`\n`))));
                    client.log(message);
                    break;
                case `NITRO`:
                    if (!args[1]) { message.channel.send(client.src.comment(`ERROR: Only allowed cases: [ON/TRUE/ENABLED or OFF/FALSE/DISABLED]`)); return client.log(message); }
                    switch (args[1].toUpperCase()) {
                        case `ON` || `TRUE` || `ENABLED`:
                            client.database.guilds.find({ id: message.guild.id }).toArray(async function (error, result) {
                                if (error) { client.error(error); };
                                if (result.length < 1) { message.channel.send(client.src.comment(`${message.guild.name} has not setup ${client.user.username}, \'${prefix}setup\' to setup ${client.user.username}.`)); return client.log(message); };
                                if (result[0].nitro) { message.channel.send(client.src.comment(`Nitro Mockup is already enabled.`)); return client.log(message); }
                                let res = { $set: { nitro: true } };
                                client.database.guilds.updateOne({ id: message.guild.id }, res, function (error) { if (error) { client.src.error(error); } });
                                message.react(client.emojis.cache.get(client.emoji.check));
                            });
                            client.log(message);
                            break;
                        case `OFF` || `FALSE` || `DISABLED`:
                            client.database.guilds.find({ id: message.guild.id }).toArray(async function (error, result) {
                                if (error) { client.error(error); };
                                if (result.length < 1) { message.channel.send(client.src.comment(`${message.guild.name} has not setup ${client.user.username}, \'${prefix}setup\' to setup ${client.user.username}.`)); return client.log(message); };
                                if (!result[0].nitro) { message.channel.send(client.src.comment(`Nitro Mockup is already disabled.`)); return client.log(message); }
                                let res = { $set: { nitro: false } };
                                client.database.guilds.updateOne({ id: message.guild.id }, res, function (error) { if (error) { client.src.error(error); } });
                                message.react(client.emojis.cache.get(client.emoji.check));
                            });
                            client.log(message);
                            break;
                    }
                    client.log(message);
                    break;
                case `PREFIX`:
                    if (!args[1]) { message.channel.send(client.src.comment(`ERROR: Prefix must be only 2 characters long, try again.`)); return client.log(message); }
                    if (args[1].includes(`\\`)) { message.channel.send(client.src.comment(`ERROR: Prefix must not contain a \\, try again.`)); return client.log(message); }
                    client.database.guilds.find({ id: message.guild.id }).toArray(async function (error, result) {
                        if (error) { client.error(error); };
                        if (result.length < 1) { message.channel.send(client.src.comment(`${message.guild.name} has not setup ${client.user.username}, \'${prefix}setup\' to setup ${client.user.username}.`)); return client.log(message); };
                        if (result[0].prefix.toUpperCase() === args[1].toUpperCase()) { message.channel.send(client.src.comment(`New prefix is the same as the old prefix.`)); return client.log(message); };
                        let res = { $set: { prefix: args[1].toLowerCase() } };
                        client.database.guilds.updateOne({ id: message.guild.id }, res, function (error) { if (error) { client.src.error(error); } });
                        message.react(client.emojis.cache.get(client.emoji.check));
                    })
                    client.log(message);
                    break;
                case `CHANNEL` || `LOG`:
                    if (!args[1]) { message.channel.send(client.src.comment(`ERROR: No channel ID provided ${prefix}channel for channel ID, try again.`)); return client.log(message); }
                    let channel = client.channels.cache.get(args[1]);
                    if (!channel) { message.channel.send(client.src.comment(`ERROR: Channel not found, try again.`)); return client.log(message); }
                    if (channel.guild.id !== message.guild.id) { message.channel.send(client.src.comment(`ERROR: Channel has to be in ${message.guild.name}, try again.`)); return client.log(message); }
                    client.database.guilds.find({ id: message.guild.id }).toArray(async function (error, result) {
                        if (error) { client.error(error); };
                        if (result.length < 1) { message.channel.send(client.src.comment(`${message.guild.name} has not setup ${client.user.username}, \'${prefix}setup\' to setup ${client.user.username}.`)); return client.log(message); };
                        if (result[0].log === args[1]) { message.channel.send(client.src.comment(`New channel is the same as the old channel.`)); return client.log(message); };
                        let res = { $set: { log: args[1] } };
                        client.database.guilds.updateOne({ id: message.guild.id }, res, function (error) { if (error) { client.src.error(error); } });
                        message.react(client.emojis.cache.get(client.emoji.check));
                    })
                    client.log(message);
                    break;
            }
        }
    })
}

module.exports.code = {
    title: "setup",
    about: "Setup %B% on the server",
    usage: ["%P%setup"],
}