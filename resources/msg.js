let moment = require(`moment`); require(`moment-duration-format`)(moment);

module.exports = async (client, message, prefix, guild) => { // Message event
    if (guild) {
        if (guild.nitro && message.content.startsWith(`:`) && message.content.endsWith(`:`) && message.content !== `::`) { // Nitro Mockup
            let msg = message.content.substring(1, message.content.length - 1), emoji = message.guild.emojis.cache.find(c => c.name.toLowerCase().includes(msg.toLowerCase())) || client.emojis.cache.find(c => c.name.toLowerCase().includes(msg.toLowerCase()));
            emoji = emoji ? emoji.toString() : null;
            if (emoji) {
                try { message.delete(); } catch (error) { client.error(error) };
                message.channel.createWebhook(`${message.guild.members.cache.get(message.author.id).displayName}, by ${client.user.username}`, message.author.avatarURL({ format: "png" })).then(webhook => {
                    webhook.send(emoji, { username: message.guild.members.cache.get(message.author.id).displayName, avatarURL: message.author.avatarURL({ format: "png" }) });
                    try { setTimeout(function () { webhook.delete(); }, 2 * 1000); } catch (error) { client.error(error) };
                })
            }
        }
    }

    let args, field = [];
    client.database.data.findOne({ case: `afk` }, async function (error, result) {
        if (error) { client.error(error); };
        if (!result) { return client.src.db(message, `afk`); };
        if (message.mentions.users.first) {
            message.mentions.users.forEach(async person => {
                let status = result.data.find(user => user.auth === person.id);
                if (status) {
                    field.push(`${client.arrow} Duration: ${moment.duration(new Date().getTime() - status.time).format(`w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds]`)}`);
                    field.push(`${client.arrow} Reason: ${status.data}`);
                    field.push(`${client.arrow} Locked: ${status.lock ? `Yes` : `No`}`);
                    let msg = await message.channel.send(client.embed().setTitle(`${person.tag} is currently AFK`).setDescription(field.join(`\n`)));
                    setTimeout(async () => { msg.delete(); }, 15 * 1000);
                    const embed = client.embed()
                        .setTitle(`Click here to view the ping!`)
                        .setURL(message.url)
                        .setDescription(`You have a pending ping while you were AFK, the message was sent by ${message.author.toString()} in ${message.channel.toString()} of guild \`${message.guild.name}\``)
                        .addField(`Message`, message.content.length > 800 ? `${message.content.substring(0, 800)}...` : message.content, false)
                        .setImage(message.attachments.first() ? message.attachments.first().url : null)
                    client.users.cache.get(person.id).send(embed);
                }
            })
        }
        let status = result.data.find(user => user.auth === message.author.id);
        if (status) { if (!status.lock && !message.content.startsWith(`${prefix}afk`) && !message.content.startsWith(`${client.prefix}afk`)) { client.commands.get(`afk`).run(client, message, [`END`], prefix, true); }; };
    })

    if (message.content.toLowerCase().startsWith(prefix.toLowerCase()) || message.content.toLowerCase().startsWith(client.prefix.toLowerCase())) {
        args = message.content.slice(prefix.length).trim().split(/ +/g);
        args.shift().toLowerCase();
        let array = message.content.split(` `), cmd = array[0].toLowerCase(), command = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
        if (command) { check(command); };
    }
    async function check(command) {
        // Check if user is in cooldown
        let now = Date.now(), timestamps = client.cooldowns.get(command.code.title);
        if (timestamps.has(message.author.id)) {
            const end = timestamps.get(message.author.id) + ((command.code.cooldown || 3) * 1000);
            if (now < end) { return message.reply(`please wait ${((end - now) / 1000).toFixed(1)} more second(s) before reusing the \`${command.code.title}\` command.`); };
        }
        // Check if user is blacklisted
        client.database.data.findOne({ case: `blacklist` }, async function (error, list) {
            if (error) { client.error(error); };
            if (!list) { return client.src.db(message, `blacklist`); };
            if (list.data.includes(message.author.id)) { return message.channel.send(client.src.comment(`Looks like you are blacklisted on ${client.user.username}!`)); };
            // Check if command is disabled
            client.database.config.findOne({ case: `toggle` }, async function (error, body) {
                if (error) { client.error(error); };
                if (body.cmds.includes(command.code.title)) { return message.channel.send(client.embed().setColor(client.util.id.failed).setTitle(`**\`Command Disabled\`**`).setURL(client.util.link.support).addField(`Need Help?`, `[Click Here!](${client.util.link.support})`).setImage(client.util.link.disabled)); };
                if (body.groups.includes(command.group)) { return message.channel.send(client.embed().setColor(client.util.id.failed).setTitle(`**\`Command Group Disabled\`**`).setURL(client.util.link.support).addField(`Need Help?`, `[Click Here!](${client.util.link.support})`).setImage(client.util.link.disabled)); };
                // Set cooldown for user, disregard if approved user, as well as run the command file
                client.database.config.findOne({ case: `data` }, async function (error, result) {
                    if (error) { client.error(error); };
                    if (!result) { return client.src.db(message, `data`, client.function.data(), null, client.database.config); };
                    let approved = result.data.find(group => group.rank === 5);
                    if (!command.code.dm && message.channel.type === `dm`) { message.channel.send(client.src.comment(`This command is not open in DMs!`)); return client.log(message); }; // Check if command is allowed in DMs
                    if (command.code.nsfw && message.channel.type !== `dm` && !message.channel.nsfw) return client.src.nsfw(message); // Check if command is NSFW 
                    let restrict, developer = result.data.find(group => group.rank === 7), owner = result.data.find(group => group.rank === 8), rank = command.code.ranks || 0;
                    if (rank === developer.rank && !developer.data.includes(message.author.id)) { restrict = 14; };
                    if (rank === owner.rank && !owner.data.includes(message.author.id)) { restrict = 16; };
                    // Check if bot is currently running
                    client.database.config.findOne({ case: `status` }, async function (error, result) {
                        if (error) { client.error(error); };
                        if (!result) { return client.src.db(message, `status`, true, null, client.database.config); };
                        if (!result.data && !developer.data.includes(message.author.id)) { return message.channel.send(client.src.comment(`${client.user.username} is currently disabled!`)); };
                        if (restrict) { message.channel.send(client.src.comment(`You are not permitted to use this command\n\'Code: ${restrict}\' - \'${prefix}errcodes\' for more information`)); return client.src.log(message); }
                        else {
                            if (!approved.data.includes(message.author.id)) { timestamps.set(message.author.id, now); setTimeout(() => timestamps.delete(message.author.id), (command.code.cooldown || 3) * 1000); };
                            let array = message.content.split(` `), cmd = array[0].toLowerCase(), postcommand = cmd.slice(prefix.length);
                            try { command.run(client, message, args, prefix); client.statcord.postCommand(postcommand, message.author.id); } catch (error) { client.error(error); return message.channel.send(client.src.comment(`There was an error trying to execute that command!\nERROR: ${error}`)); };
                            client.database.config.findOne({ case: `count` }, async function (error, result) {
                                if (error) { client.error(error); };
                                if (!result) { return client.src.db(message, `count`, 0, null, client.database.config); };
                                result.data++;
                                let res = { $set: { data: result.data } };
                                client.database.config.updateOne({ case: `count` }, res, function (error) { if (error) { client.src.error(error); }; });
                            })
                        }
                    })
                })
            })
        })
    }
}