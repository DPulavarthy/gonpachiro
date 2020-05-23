/*
       __               _                    ___       ____   _                               __   __            __ 
      / /____   ____   (_)____              /   |     / __ \ (_)_____ _____ ____   _____ ____/ /  / /_   ____   / /_
 __  / // __ \ / __ \ / // __ \   ______   / /| |    / / / // // ___// ___// __ \ / ___// __  /  / __ \ / __ \ / __/
/ /_/ // /_/ // / / // // / / /  /_____/  / ___ |   / /_/ // /(__  )/ /__ / /_/ // /   / /_/ /  / /_/ // /_/ // /_  
\____/ \____//_/ /_//_//_/ /_/           /_/  |_|  /_____//_//____/ \___/ \____//_/    \____/  /_____/ \____/ \__/  
    ____               __ __                                      __                     __   __  ___                    
   / __ ) __  __ _    / //_/__  __ _____ ____ _ _____ ____ _ ____/ /  ____ _ ____   ____/ /  /  |/  /____ _ __  __ __  __
  / __  |/ / / /(_)  / ,<  / / / // ___// __ `// ___// __ `// __  /  / __ `// __ \ / __  /  / /|_/ // __ `// / / // / / /
 / /_/ // /_/ /_    / /| |/ /_/ // /   / /_/ /(__  )/ /_/ // /_/ /  / /_/ // / / // /_/ /  / /  / // /_/ // /_/ // /_/ / 
/_____/ \__, /(_)  /_/ |_|\__,_//_/    \__,_//____/ \__,_/ \__,_/   \__,_//_/ /_/ \__,_/  /_/  /_/ \__,_/ \__, / \__,_/  
       /____/                                                                                            /____/                                                                                             

*/

const Discord = require(`discord.js`);
const client = new Discord.Client();
const fs = require('fs');
const superagent = require("superagent");
const package = require(`./package.json`);
const DBL = require("dblapi.js");
client.queue = new Map();
client.util = require(`./util.js`);
client.send = require(`./send.js`);
client.config = require(`./config.json`);
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.bin = async (client, data) => {
    let res = await require("superagent").post(`https://paste.marksbot.mwserver.site/pastebin/api`).set("Authorization", `kasumi`).send({ content: data });
    if (res.status !== 200) return `[${res.status}]: Pastebin error`;
    if (res.body.status !== "Success") return `Pastebin error`;
    return res.body.url;
}

["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});


client.on(`ready`, async () => {
    client.send.startup(client);
    client.arrow = client.emojis.cache.get(client.util.emoji.right_arrow).toString();
    client.blank = client.emojis.cache.get(client.util.emoji.blank).toString();
    const dbl = new DBL(client.util.api.dbl, client);
    let home = client.guilds.cache.get(client.util.id.guild);
    home.channels.cache.get(client.util.id.member_count).setName(`Members: ${home.memberCount}`).catch(error => client.send.process(error));
    home.channels.cache.get(client.util.id.guild_count).setName(`Guilds: ${client.guilds.cache.size}`).catch(error => client.send.process(error));
    home.channels.cache.get(client.util.id.channel_count).setName(`Channel Count: ${home.channels.cache.size}`).catch(error => client.send.process(error));
    dbl.getBot(client.util.id.client).then(async data => {
        await home.channels.cache.get(client.util.id.total_vote).setName(`Total Upvotes: ${data.points}`).catch(error => client.send.processes(error));
        await home.channels.cache.get(client.util.id.month_vote).setName(`Monthly Upvotes: ${data.monthlyPoints}`).catch(error => client.send.processes(error));
    })
    await client.user.setStatus(`online`); // Categories: online, idle, dnd, invisible
    await client.user.setActivity(`${client.guilds.cache.size} guilds | ${client.config.prefix}help`, { type: `WATCHING` }); // Categories: PLAYING, STREAMING, LISTENING, WATCHING
    await dbl.postStats(client.guilds.size);
    console.log(`Connected as ${client.user.tag} -- ${client.user.username} Online`);
    console.log(`${client.user.username} has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds. Version: v${package.version} released or updated.`);
    client.channels.cache.get(client.util.id.master_log).send(`${client.user.username} has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds. Version: v${package.version} released or updated.`);
});

client.on(`guildCreate`, async guild => {
    if (guild.id === `538361750651797504`) return;
    const dbl = new DBL(client.util.api.dbl, client);
    const embed = client.send.embed()
        .setTitle(`New Guild Acclaimed!`)
        .addField(`Guild Name`, guild.name, false)
        .addField(`Guild ID`, guild.id, false)
        .addField(`Member Count`, guild.memberCount - 1, true)
        .addField("Humans", `${guild.members.cache.filter(member => !member.user.bot).size} `, true)
        .addField("Bots", `${guild.members.cache.filter(member => member.user.bot).size}` - 1, true)
        .addField(`Owner`, `${guild.owner.user.tag}[${guild.owner.id}]`, false);
    client.channels.cache.get(client.util.id.guild_log).send(embed);
    client.user.setActivity(`${client.guilds.cache.size} guilds | ${client.config.prefix}help`, { type: `WATCHING` });
    let home = client.guilds.cache.get(client.util.id.guild);
    await home.channels.cache.get(client.util.id.guild_count).setName(`Guilds: ${client.guilds.cache.size}`).catch(error => client.send.process(error));
    dbl.postStats(client.guilds.size);
});


client.on(`guildDelete`, async guild => {
    if (guild.id === `538361750651797504`) return;
    const dbl = new DBL(client.util.api.dbl, client);
    const embed = client.send.embed()
        .setTitle(`Guild Lost!`)
        .addField(`Guild Name`, guild.name, false)
        .addField(`Guild ID`, guild.id, false)
        .addField(`Member Count`, guild.memberCount, true)
        .addField("Humans", `${guild.members.cache.filter(member => !member.user.bot).size} `, true)
        .addField("Bots", `${guild.members.cache.filter(member => member.user.bot).size}`, true)
        .addField(`Owner`, `${guild.owner.user.tag}[${guild.owner.id}]`, false)
    client.channels.cache.get(client.util.id.guild_log).send(embed);
    client.user.setActivity(`${client.guilds.cache.size} guilds | ${client.config.prefix}help`, { type: `WATCHING` });
    let home = client.guilds.cache.get(client.util.id.guild);
    await home.channels.cache.get(client.util.id.guild_count).setName(`Guilds: ${client.guilds.cache.size}`).catch(error => client.send.process(error));
    dbl.postStats(client.guilds.size);
})

client.on('guildMemberAdd', async (guildMember) => {
    if (guildMember.guild.id === client.util.id.guild) { // Jonin Support
        if (guildMember.user.bot) {
            guildMember.addRole(guildMember.guild.roles.find(role => role.name === "Inferior Bots"));
            return;
        }
        let home = client.guilds.cache.get(client.util.id.guild);
        await home.channels.cache.get(client.util.id.member_count).setName(`Members: ${home.memberCount}`).catch(error => client.send.process(error));
        guildMember.roles.add(guildMember.guild.roles.cache.find(role => role.name === "Hu-man")).catch(error => client.send.process(error));
        guildMember.roles.add(guildMember.guild.roles.cache.find(role => role.name === "Per-sun")).catch(error => client.send.process(error));
        guildMember.roles.add(guildMember.guild.roles.cache.find(role => role.name === "Yae Village Member")).catch(error => client.send.process(error));
        let message = guildMember.toString() + `, Welcome to ` + guildMember.guild.name + `, you can find the rules in ` + client.channels.cache.get(`670276578625978368`).toString() + `\n` +
            `You can see ${client.user.username}'s information in ` + client.channels.cache.get(`672312953986482176`).toString() + `\n` +
            `If you are here for support, ask in ` + client.channels.cache.get(`670123772363145235`).toString() + ` or ` + client.channels.cache.get(`672268546289565758`).toString();
        return client.channels.cache.get(`666355397585797150`).send(message);
    }
    if (guildMember.guild.id === `678226695190347797`) { // Jonny's Development
        guildMember.roles.add(guildMember.guild.roles.cache.find(role => role.name === "Member")).catch(error => client.send.process(error));
    }
});

client.on(`guildMemberRemove`, async (guildMember) => {
    if (guildMember.guild.id === client.util.id.guild) {
        let home = client.guilds.cache.get(client.util.id.guild);
        await home.channels.cache.get(client.util.id.member_count).setName(`Members: ${home.memberCount}`).catch(error => client.send.process(error));
        let message = `${guildMember.toString()}, just left the server [${guildMember.guild.name}]`;
        return client.channels.cache.get(`666355397585797150`).send(message);
    }
});

client.on(`channelCreate`, async channel => {
    if (channel.type === `dm`) return;
    let home = client.guilds.cache.get(client.util.id.guild);
    if (channel.guild.id === home.id) {
        await home.channels.cache.get(client.util.id.channel_count).setName(`Channel Count: ${home.channels.cache.size}`).catch(error => client.send.process(error));
    }
});

client.on(`channelDelete`, async channel => {
    if (channel.type === `dm`) return;
    let home = client.guilds.cache.get(client.util.id.guild);
    if (channel.guild.id === home.id) {
        await home.channels.cache.get(client.util.id.channel_count).setName(`Channel Count: ${home.channels.cache.size}`).catch(error => client.send.process(error));
    }
});

client.on('messageDelete', message => {
    if (message.guild.id === client.util.id.guild) {
        let field = ``;
        field += `${client.arrow} Author: ${message.author.tag}\n`;
	field += `${client.arrow} Created: ${message.createdAt.toUTCString()}\n`;
        field += `${client.arrow} Deleted: ${new Date().toUTCString()}\n`;
        const embed = client.send.embed()
            .setAuthor(`Message Deleted`)
            .setDescription(field)
            .addField(`Context`, `\`\`\`\n${message.content}\n\`\`\``, false)
        client.channels.cache.get(client.util.id.events_log).send(embed)
        console.log(`A message saying "${message.content}" was deleted from channel: ${message.channel.name} at ${new Date().toUTCString()}`);
    }
});
/*
client.on('messageUpdate', (oldMsg, newMsg) => {
   if (oldMsg.guild.id === client.util.id.guild) {
        let field = ``;
        field += `${client.arrow} By: ${oldMsg.author.tag}\n`;
        field += `${client.arrow} At: ${oldMsg.createdAt.toUTCString()}`;
        const embed = client.send.embed()
            .setAuthor(`Message Edited`)
            .setDescription(field)
            .addField(`Original Message`, `\`\`\`\n${oldMsg.content}\n\`\`\``, false)
            .addField(`New Message`, `\`\`\`\n${newMsg.content}\n\`\`\``, false)
        client.channels.cache.get(client.util.id.events_log).send(embed)
        console.log(`A message saying "${oldMsg.content}" was edited in channel: ${oldMsg.channel.name} at ${oldMsg.createdAt.toUTCString()}, new content: ${newMsg}`);
    }
});
*/
client.on(`message`, async message => {
    if (message.author.bot) return;
    if (message.content.startsWith(`:`) && message.content.endsWith(`:`)) {
        client.send.getEmoji(message, message.content.substring(1, message.content.length - 1)).then(emoji => {
            if (emoji) {
                emoji = client.emojis.cache.get(emoji.id)
                if (emoji.animated) {
                    message.delete();
                    message.channel.createWebhook(message.guild.members.cache.get(message.author.id).displayName, message.author.avatarURL({ format: "png" })).then(webhook => {
                        webhook.send(emoji.toString(), {
                            username: message.guild.members.cache.get(message.author.id).displayName,
                            avatarURL: message.author.avatarURL({ format: "png" }),
                        });
                        setTimeout(function () {
                            webhook.delete();
                        }, 2 * 1000);
                    })
                }
            }
        })
    }
    if (message.channel.type === `dm` && message.author.id != client.user.id) {
        const embed = client.send.embed()
            .addField(`User Name`, `\`\`\`\n${message.author.tag}[${message.author.id}]\n\`\`\``, false)
            .addField(`User Sent`, `\`\`\`\n${message.content}\n\`\`\``, false);
        client.channels.cache.get(client.util.id.dm_log).send(embed);
    }
    if (message.mentions.users.first) {
        message.mentions.users.forEach(user => {
            if (client.send.afk(user.id)) {
                if (message.channel.type === `dm`) return;
                client.users.cache.get(user.id).send(`You have a pending ping while you were AFK, the message was sent by ${message.author.toString()} in ${message.channel.toString()} of guild \`${message.guild.name}\`\nHere is the link to the ping: ${message.url}`)
                message.channel.send(user.tag + ` is currently AFK and left this message: ${client.send.reason(user.id)}`)
            }
        })
    }
    if (message.content.startsWith(client.config.prefix)) {
        if (message.author.bot) return; // Ignore other Clients and ignore itself
        if (message.content.toLowerCase().indexOf(client.config.prefix) !== 0) return; // Ignore any message that does not start with our prefix
        if (client.send.exists(message.content) && client.send.maintenance() && message.content !== `${client.config.prefix}status` && !client.send.approve(message.author.id, `developer`)) return message.channel.send(`${client.user.username} is currently down for maintenance \`${client.config.prefix}status\` for more information`)
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g); // Separate the `command` name, and the `arguments` for the command.
        const command = args.shift().toLowerCase();
        let prefix = client.config.prefix;
        let messageArray = message.content.split(" ")
        let cmd = messageArray[0].toLowerCase();
        let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
        if (commandfile) {
            if (message.channel.type === `dm`) return message.author.send(`${client.user.username}'s commands are currently not open to DMs`);
            if (message.guild.id === require(`./queue.json`).id) return;
            commandfile.run(client, message, args);
            fs.readFile('./count.json', 'utf-8', function (err, data) {
                if (err) throw err
                let object = JSON.parse(data);
                object.count++;
                fs.writeFile('./count.json', JSON.stringify(object, null, 4), function (err) {
                    if (err) {
                        console.log('Error writing file', err)
                    }
                })
            });
        }
    } else if (message.content.startsWith(client.config.back_up)) {
        if (message.author.bot) return; // Ignore other Clients and ignore itself
        if (message.content.toLowerCase().indexOf(client.config.back_up) !== 0) return; // Ignore any message that does not start with our prefix
        if (/*client.send.exists(message) &&*/ client.send.maintenance() && message.content !== `${client.config.back_up}status` && !client.send.approve(message.author.id, `owner`)) return message.channel.send(`${client.user.username} is currently down for maintenance \`${client.config.back_up}status\` for more information`)
        const args = message.content.slice(client.config.back_up.length).trim().split(/ +/g); // Separate the `command` name, and the `arguments` for the command.
        const command = args.shift().toLowerCase();
        let prefix = client.config.back_up;
        let messageArray = message.content.split(" ")
        let cmd = messageArray[0].toLowerCase();
        let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
        if (commandfile) {
            if (message.channel.type === `dm`) return message.author.send(`${client.user.username}'s commands are currently not open to DMs`);
            if (message.guild.id === require(`./queue.json`).id) return;
            commandfile.run(client, message, args);
            fs.readFile('./count.json', 'utf-8', function (err, data) {
                if (err) throw err
                let object = JSON.parse(data);
                object.count++;
                fs.writeFile('./count.json', JSON.stringify(object, null, 4), function (err) {
                    if (err) {
                        console.log('Error writing file', err)
                    }
                })
            });
        }
    } else if (message.content.startsWith(`s.`)) {
        if (message.author.bot) return; // Ignore other Clients and ignore itself
        if (message.content.toLowerCase().indexOf("s.") !== 0) return; // Ignore any message that does not start with our prefix
        const args = message.content.slice("s.".length).trim().split(/ +/g); // Separate the `command` name, and the `arguments` for the command.
        const command = args.shift().toLowerCase();
        let prefix = "s.";
        let messageArray = message.content.split(" ")
        let cmd = messageArray[0].toLowerCase();
        let direct = cmd.slice(client.config.prefix.length);
        if (direct !== `join` && direct !== `slut` && direct !== `inq` && direct !== `next` && direct !== `fjern` && direct !== `list`) return;
        let commandfile = client.commands.get("sune");
        if (commandfile) {
            if (message.channel.type === `dm`) return message.author.send(`${client.user.username}'s commands are currently not open to DMs`);
            commandfile.run(client, message, args);
            fs.readFile('./count.json', 'utf-8', function (err, data) {
                if (err) throw err
                let object = JSON.parse(data);
                object.count++;
                fs.writeFile('./count.json', JSON.stringify(object, null, 4), function (err) {
                    if (err) {
                        console.log('Error writing file', err)
                    }
                })
            });
        }
    }
});

client.login(client.config.token);