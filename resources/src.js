let client;
require('colors');
module.exports = {
    async startup(input) {
        client = input[0];
        client.msg = require(`./msg.js`);
        client.util = require(`./util.js`);
        client.function = require(`./function.js`);
        client.function.startup(client);
        // client.function.ping();
        client.function.status();
        // client.function.update(true);
        // client.function.database(input[1]);
        // client.chart = client.function.chart;
        client.prefix = process.env.PREFIX;
        client.token = process.env.TOKEN;
        client.embed = client.src.embed;
        client.error = client.src.error;
        client.log = client.src.log;
        client.emoji = client.util.emoji;
        client.arrow = client.emojis.cache.get(client.emoji.arrow).toString();
        client.blank = client.emojis.cache.get(client.emoji.blank).toString();
        // let Statcord = require(`statcord.js`)
        // client.statcord = new Statcord.Client(client.key.statcord, client);
        // client.bin = async (data) => { let res = await require(`superagent`).post(`https://paste.marksbot.mwserver.site/pastebin/api`).set(`Authorization`, client.key.bin).set(`User-Agent`, `Pastebin services`).send({ content: data }); if (res.status !== 200) return `[${res.status}]: Pastebin error`; if (res.body.status !== `Success`) return `Pastebin error`; return res.body.url; };
        // let cron = require(`cron`), reset = new cron.CronJob(`* * 0 * * *`, client.function.reset, null, true, `America/Chicago`), gacha = new cron.CronJob(`* * 0 * * 0`, client.function.gacha, null, true, `America/Chicago`), initalPost = await client.statcord.autopost();
        // reset.start(); gacha.start(); 
        // client.function.key();
        // if (initalPost) { client.error(initalPost); process.exit(); };
        console.log(`${`[PROGRM]: ${client.user.tag} Connection Successful!`.yellow}`);
    },
    error(input) { console.log(`${`[ERROR!]: ${input}`.red}`); },
    comment(input) { return client.embed().setTitle(`**\`${input}\`**`); },
    code(input, type) { input = input ? input : `N/A`; return `\`\`\`${type || ``}\n${input}\n\`\`\``; },
    async getUser(members, input) { return input ? await members.find(member => member.user.tag.toLowerCase().includes(input.toLowerCase())) || false : false; },
    async getRole(roles, input) { return input ? await roles.find(role => role.name.toLowerCase().includes(input.toLowerCase())) || false : false; },
    async getEmoji(emojis, args) { return args ? emojis.find(emoji => emoji.id === args.toLowerCase()) : false; },
    async db(message, input, info, remove, collection) { return; collection = collection || client.database.data; if (remove) { collection.deleteOne({ case: input }, function (error) { if (error) { client.src.error(error); }; }); } else { collection.insertOne({ case: input, data: info || [] }, function (error) { if (error) { client.src.error(error); }; if (message) { message.channel.send(client.src.comment(`A document with case \'${input}\' has been created.\nRerun the command!`)) } }); }; },
    async userlist(message, args) {
        let user = [];
        if (!args.join(` `)) { return [client.users.cache.get(message.author.id)]; };
        for (let arg of args) {
            if (client.users.cache.get(arg)) { user.push(client.users.cache.get(arg)) }
            else if (arg.toUpperCase() === `OWNER`) { user.push(client.users.cache.get(message.guild.owner.user.id)); }
            else if (arg.toUpperCase() === `LATEST`) { user.push(client.src.rank(message, null, message.guild.members.cache.size)); }
            else if (arg.startsWith(`<@!`) && arg.endsWith(`>`)) { user.push(client.users.cache.get(arg.substring(3, arg.length - 1))); }
            else if (arg.startsWith(`<@`) && arg.endsWith(`>`)) { user.push(client.users.cache.get(arg.substring(2, arg.length - 1))); }
            else { await client.src.getUser(message.guild.members.cache, arg).then(res => { if (res) { user.push(client.users.cache.get(res.id)); }; }); }
        };
        return user;
    },
    clean(input, prefix) {
        let original = [`%P%`, `%B%`], replace = [prefix || client.prefix, client.user.username];
        for (let i = 0; i < original.length; i++) { while (input.includes(original[i])) { let loc = input.indexOf(original[i]); input = `${input.substring(0, loc)}${replace[i]}${input.substring(loc + original[i].length)}`; }; };
        return input;
    },
    embed(input) {
        let Discord = require(`discord.js`), embed = new Discord.MessageEmbed()
            .setFooter(input ? `Provided by: ${client.user.tag} & ${input} API` : `Provided by: ${client.user.tag}`, client.user.avatarURL({ format: "png", dynamic: true, size: 2048 }))
            .setColor(client.util.id.main)
            .setTimestamp()
        return embed;
    },
    loading() {
        const embed = client.embed()
            .setTitle(`Loading${client.emojis.cache.get(client.emoji.processing).toString()}`)
            .setColor(client.util.id.loading)
            .setURL(client.util.link.support)
        return embed;
    },
    nsfw(message, input) {
        let list = [];
        message.guild.channels.cache.forEach(channel => { if (channel.nsfw) { list.push(channel.toString()); } })
        const embed = client.embed()
            .setTitle(input ? `NSFW channels for ${message.guild.name}` : `***Command Terminated!***`)
            .setThumbnail(input ? client.user.avatarURL({ format: "png", dynamic: true, size: 2048 }) : client.util.link.error)
            .setColor(client.util.id.failed)
            .setDescription(input || `Reason: Cannot send possible NSFW content in an SFW channel!`)
            .addField(list.length > 0 ? `Try in one of these channels` : `\u200b`, list.length > 0 ? client.src.crop(list.join(`\n`), `field`) : `No NSFW channels found\nEdit Channel > Overview > NSFW - Toggle On`, false)
            .setImage(list.length > 0 ? `` : client.util.link.nsfw)
        return message.channel.send(embed);
    },
    crop(input, type, char) {
        if (type && type.toUpperCase() === `FIELD`) {
            char = char ? char : ` `;
            if (input.length > 800) { input = input.substring(0, 797); return `${input.substring(0, input.lastIndexOf(char))}...`; } else { return input; };
        }
        if (type && type.toUpperCase() === `DESCRIPTION`) {
            char = char ? char : ` `;
            if (input.length > 2048) { input = input.substring(0, 2045); return `${input.substring(0, input.lastIndexOf(char))}...`; } else { return input; };
        }
    },
    block(message, code) {
        message.channel.send(client.embed().setDescription(`${client.emojis.cache.get(client.emoji.input).toString()} Input\n${client.src.code(message.content)}\n${client.emojis.cache.get(client.emoji.output).toString()} Output\n${client.src.code(`- ERROR!\n${code === 16 ? `To use this command you must be approved by the owners!` : `To use this command you must be approved by the Devs, Mods, or Gonpachiro users!`}\n**Code ${code === 16 ? `16` : `14`}** \`${process.env.PREFIX}errcodes <err>\` to view error type`)}\nStatus: ${client.emojis.cache.get(client.emoji.red).toString()} - Failed`), `diff`);
        return client.src.log(message);
    },
    invalid(message, input, result, note, prefix, image) {
        const embed = client.embed()
            .setAuthor(`${message.guild.members.cache.get(message.author.id).displayName}`, message.author.displayAvatarURL(), client.util.link.support)
            .setDescription(`You have entered an invalid command, below is the proper way to use it\nInput: ${client.src.clean(input, prefix)}\nResult: ${client.src.clean(result, prefix)}\n${note ? note : ``}`)
            .setImage(image || null)
            .setColor(client.util.id.failed)
        message.channel.send(embed)
        return client.src.log(message);
    },
    log(message, info) {
        let data = info ? clean(info) : ``, log = `\`${clean(message.author.username)}\` sent: \`${clean(message.content)}\` ${message.channel.type === `dm` ? `in \`DMs\`` : `in channel \`${clean(message.channel.name)}\` of guild \`${clean(message.guild.name)}\``}`;
        console.log(`${`[INFORM]: ${log}`.brightMagenta}`);
        log += data && data !== `hiro` ? `\`[${data}]\` \` TIN: ${message.author.id} \`` : ` \` TIN: ${message.author.id} \``;
        // client.database.config.findOne({ case: `logs` }, async function (error, result) {
        //     if (error) { client.error(error); };
        //     if (!result) { result = await client.src.db(message, `logs`, null, null, client.database.config); };
        //     if (result.data.length >= 5) { result.data.shift(); };
        //     result.data.push(log);
        //     let res = { $set: { data: result.data } };
        //     client.database.config.updateOne({ case: `logs` }, res, function (error) { if (error) { client.src.error(error); } });
        //     if (data === `hiro`) { log = client.src.code(log, `fix`); };
        //     client.channels.cache.get(client.util.id.log).send(log);
        //     if (message.channel.type !== `dm`) {
        //         client.database.guilds.findOne({ id: message.guild.id }, async function (error, result) {
        //             if (error) { client.error(error); };
        //             if (!result) return;
        //             result.count++;
        //             let res = { $set: { count: result.count } };
        //             client.database.guilds.updateOne({ id: message.guild.id }, res, function (error) { if (error) { client.src.error(error); } });
        //         })
        //     }
        //     let args = message.content.slice(client.prefix.length).trim().split(/ +/g);
        //     args.shift().toLowerCase();
        //     let array = message.content.split(` `), cmd = array[0].toLowerCase(), command = client.commands.get(cmd.slice(client.prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(client.prefix.length)));
        //     client.database.commands.findOne({ case: command.code.title }, async function (error, result) {
        //         if (error) { client.error(error); };
        //         if (!result) { return client.src.db(null, command.code.title, 1, null, client.database.commands); };
        //         result.data++;
        //         let res = { $set: { data: result.data } };
        //         client.database.commands.updateOne({ case: command.code.title }, res, function (error) { if (error) { client.src.error(error); } });
        //     })
        // })
        function clean(input) { return input.replace(/`|"/g, `\'`); };
    },
    status(simple) {
        let final = [];
        if (!client.db) { final.push(`Database Offline`); }
        else if (client.db) { client.database.config.findOne({ case: `status` }, async function (error, result) { if (error) { client.error(error); }; if (!result.data) { final.push(`Currently Disabled`); }; }) };
        if (simple) { return final.length > 0 ? `${client.emojis.cache.get(client.emoji.red)} **[${client.user.tag}:](${client.util.link.support})** ${final.join(`, `)}` : `${client.emojis.cache.get(client.emoji.green)} **[${client.user.tag}:](${client.util.link.support})** All Systems Operational` };
        if (final.length > 0) { return `${client.emojis.cache.get(client.emoji.warning).toString()} ${final.join(`, `)}.`; }
        else { return `${client.emojis.cache.get(client.emoji.check).toString()} All Systems Operational, Running master prefix \`${client.prefix}\`` };
    },
    rank(message, id, loc, type) {
        let arr = message.guild.members.cache.array(), pos = 0;
        arr.sort((a, b) => a.joinedAt - b.joinedAt);
        if (loc && isNaN(parseInt(loc))) { return null; }
        else if (loc && !isNaN(parseInt(loc))) { let id = arr[loc - 1].id; return client.users.cache.get(id); }
        else {
            for (let i = 0; i < arr.length; i++) { if (arr[i].id == id) pos = i + 1; };
            if (type && type.toUpperCase() === `INT`) { return pos };
            if (pos % 10 === 1 && pos != 11) { pos = `${pos.toString()}st`; }
            else if (pos % 10 == 2 && pos != 12) { pos = `${pos.toString()}nd`; }
            else if (pos % 10 == 3 && pos != 13) { pos = `${pos.toString()}rd`; }
            else { pos = `${pos.toString()}th`; }
            return pos;
        }
    },
    report(message, error) {
        const embed = client.embed()
            .setTitle(`***Something Went Wrong!***`)
            .setColor(client.util.id.failed)
            .setThumbnail(client.util.link.error)
            .setDescription(`An error has occured and has caused the command to be terminated, the error has been reported and will be fixed soon.\n${client.src.code(error, `xl`)}\nSource: ${message.content}`)
        message.channel.send(embed);
        //client.channels.cache.get(client.util.id.errors).send(embed);
        return client.log(message);
    },
    require(message, input, code) {
        const embed = client.embed()
            .setTitle(`***Command Terminated!***`)
            .setColor(client.util.id.failed)
            .setThumbnail(client.util.link.error)
            .setDescription(`${input}\n Error Code: ${code} [\'${client.prefix}err ${code}\' for more info]`)
        message.channel.send(embed);
        return client.log(message);
    }
}