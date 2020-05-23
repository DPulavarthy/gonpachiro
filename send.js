const Discord = require(`discord.js`);
const fs = require(`fs`);
var maintenance = false;
var disabled = [];
var lastLogs = [];
var reason = [];
var afk = [];
var commands;
var client;
var lineCount;
var warn;
var idx = 0;

module.exports = {
    startup(input) {
        client = input;
    },
    setCMD(input) {
        commands = input;
    },
    setLines(input) {
        lineCount = input;
    },
    getCMD() {
        return commands;
    },
    getLines() {
        return lineCount;
    },
    getLog() {
        if (idx === 0) {
            return `No new logs recorded since last start-up!\n`;
        } else {
            var sendlog = ``;
            for (var i = 0; i < idx; i++) {
                if (lastLogs[i]) {
                    if (lastLogs[i].startsWith("```")) {
                        sendlog += (i + 1) + `. ` + lastLogs[i].substring(7, loc) + `\n`;
                    } else {
                        sendlog += (i + 1) + `. ` + lastLogs[i] + `\n`;
                    }
                }
            }
            return sendlog;
        }
    },
    log(message, info) {
        let user = clean(message.author.username),
            content = clean(message.content),
            channel = clean(message.channel.name),
            guild = clean(message.guild.name),
            data = clean(info);
        var log = `\`${user}\` sent: \`${content}\` in channel \`${channel}\` of guild \`${guild}\``;
        console.log(log);
        if (data && data !== `hiro`) {
            log += ` \`[` + data + `]\`` + ` \` TIN: ` + message.guild.id + ` \``;
        } else {
            log += ` \` TIN: ` + message.guild.id + ` \``;
        }
        if (idx >= 5) {
            for (var i = 0; i < idx; i++) {
                lastLogs[i] = lastLogs[i + 1];
            }
            idx--;
        }
        lastLogs[idx++] = log;
        if (data === `hiro`) {
            log = `\`\`\`fix\n` + log + `\n\`\`\``;
        }
        client.channels.cache.get(client.util.id.master_log).send(log);
        function clean(message) {
            if (message && !parseInt(message)) {
                while (message.includes(`\``)) {
                    let loc = message.indexOf(`\``);
                    message = message.substring(0, loc) + `'` + message.substring(loc + 1);
                }
                return message;
            }
        }
    },
    embed(input) {
        const embed = new Discord.MessageEmbed()
            .setColor(client.util.embed.main)
            //.addField(`Links`, `[Invite](` + client.util.link.invite + `)` + ` **|** ` + `[Support](` + client.util.link.support + `)` + ` **|** ` + `[Donate](` + client.util.link.donate + `)` + ` **|** ` + `[Site](` + client.util.link.website + `) **|** ${client.config.prefix}g`, false)
            .setFooter(client.util.embed.footer)
            .setTimestamp()
        if (input) {
            embed.setFooter(client.util.embed.footer + ` & ${input} API`)
        }
        return embed;
    },
    loading() {
        const embed = client.send.embed()
            .setColor(client.util.embed.loading)
            .setTitle(`Loading` + client.emojis.cache.get(client.util.emoji.embed_loading).toString())
            .setURL(client.util.link.support)
            .setFooter(client.util.embed.footer)
            .setTimestamp()
        return embed;
    },
    status(input) {
        if (input === `list`) {
            return disabled;
        }
        if (disabled.includes(input)) {
            return true;
        } else {
            return false;
        }
    },
    globalOFF(input) {
        try {
            var cmd = client.commands.get(client.aliases.get(input)).code || client.commands.get(input).code;
        } catch (error) {
            return `Failed, error: ${error}`;
        }
        if (cmd) {
            disabled.push(input)
            return `success`;
        }
    },
    globalON(input) {
        let loc = disabled.indexOf(input);
        delete disabled[loc];
    },
    setAFK(input, message) {
        afk.push(input);
        reason.push(message);

    },
    afk(input) {
        if (afk.includes(input)) {
            return true;
        } else {
            return false;
        }
    },
    endAFK(input) {
        let loc = afk.indexOf(input);
        delete afk[loc];
        delete reason[loc];
    },
    reason(input) {
        let loc = afk.indexOf(input);
        return reason[loc];
    },
    down(input) {
        maintenance = true;
        if (!input) {
            warn = `General maintenance`
        } else {
            warn = input;
        }
        client.user.setStatus(`dnd`); // Categories: online, idle, dnd, invisible
        client.user.setActivity(`down for maintenance`, { type: `PLAYING` }); // Categories: PLAYING, STREAMING, LISTENING, WATCHING
    },
    up() {
        maintenance = false;
        client.user.setStatus(`online`); // Categories: online, idle, dnd, invisible
        client.user.setActivity(`${client.guilds.cache.size} guilds | ${client.config.prefix}help`, { type: `WATCHING` }); // Categories: PLAYING, STREAMING, LISTENING, WATCHING
    },
    maintenance(input) {
        if (input) {
            return warn;
        } else {
            return maintenance;
        }
    },
    approve(input, type) {
        if (input) {
            input = input.toLowerCase();
        }
        if (type) {
            type = type.toLowerCase();
        }
        var approved = [`476812566530883604`, `568824243396149248`, `146040787891781632`, `234914515106529283`, `255393612798492672`, `272442568275525634`,`189238841054461952`]; // HVKurasad, Mayu, Jonny™, NEFFR, Redanzo, markawes, TXJ
        var honorary = [`444471224400216075`, `226594042991869953`, `452206023802093571`]; // kairi, kiyoshi, darsh_thebeast
        var alder = [];
        var gate_keeper = [];
        var shirne_maiden = [];
        var moderator = [`476812566530883604`, `568824243396149248`, `146040787891781632`, `234914515106529283`, `255393612798492672`]; // HVKurasad, Mayu, Jonny™, NEFFR, Redanzo
        var developer = [`476812566530883604`, `568824243396149248`, `272442568275525634`, `189238841054461952`]; //  HVKurasad, Mayu, markawes, TXJ
        var owner = [`476812566530883604`, `568824243396149248`]; //  HVKurasad, Mayu
        if (input === `owner`) {
            return owner;
        }
        if (input === `developer`) {
            return developer;
        }
        if (input === `moderator`) {
            return moderator;
        }
        if (input === `honorary`) {
            return honorary;
        }
        if (input === `approved`) {
            return approved;
        }
        if (input && type === `approved`) {
            if (approved.includes(input)) {
                return true;
            } else {
                return false;
            }
        }
        if (input && type === `honorary`) {
            if (honorary.includes(input)) {
                return true;
            } else {
                return false;
            }
        }
        if (input && type === `moderator`) {
            if (moderator.includes(input)) {
                return true;
            } else {
                return false;
            }
        }
        if (input && type === `developer`) {
            if (developer.includes(input)) {
                return true;
            } else {
                return false;
            }
        }
        if (input && type === `owner`) {
            if (owner.includes(input)) {
                return true;
            } else {
                return false;
            }
        }
        const embed = client.send.embed();
        if (approved.includes(input) || honorary.includes(input) || moderator.includes(input) || developer.includes(input) || owner.includes(input)) {
            var i = 0;
            var list = ``;
            var arrow = client.emojis.cache.get(client.util.emoji.right_arrow).toString();
            if (owner.includes(input)) {
                i++;
                list += `${arrow}**Owner of ${client.user.username}**` + `\n`;
            }
            if (approved.includes(input)) {
                i++;
                list += `${arrow}Approved user of ${client.config.prefix}/hiro commands` + `\n`;
            }
            if (honorary.includes(input)) {
                i++;
                list += `${arrow}Honorary member for ${client.user.username}` + `\n`;
            }
            if (moderator.includes(input)) {
                i++;
                list += `${arrow}Moderator of ${client.user.username}` + `\n`;
            }
            if (developer.includes(input)) {
                i++;
                list += `${arrow}Developer of ${client.user.username}` + `\n`;
            }
            embed.addField(`User Position`, list, false);
            if (i > 1) {
                embed.setDescription(`You are an approved member of ${client.user.username}, here are your positions`);
            } else {
                embed.setDescription(`You are an approved member of ${client.user.username}, here is your position`);
            }
        } else {
            embed.setDescription(`Sorry, you are not an approved member of ${client.user.username}`);
        }
        return embed;
    },
    getUser(args) {
        findUser = async function (client, args) {
            if (!args) return null;
            const matches = args.match(/^(?:<@!?)?([0-9]+)>?$/);
            if (!matches) {
                let u = await client.users.cache.find(c => c.tag.toLowerCase().includes(args.toLowerCase()));
                if (!u) return null;
                return u;
            }
            return await client.users.fetch(matches[1], false);
        }
        return findUser(client, args);
    },
    getRole(message, args) {
        findRole = async function (client, args) {
            if (!args) return null;
            const matches = args.match(/^(?:<@!?)?([0-9]+)>?$/);
            if (!matches) {
                let r = await message.guild.roles.cache.find(c => c.name.toLowerCase().includes(args.toLowerCase()));
                if (!r) return null;
                return r;
            }
            return await message.guild.roles.fetch(matches[1], false);
        }
        return findRole(client, args);
    },
    async getEmoji(message, args) {
        if (!args) return null;
        let e = await message.guild.emojis.cache.find(c => c.name.toLowerCase() === args.toLowerCase());
        if (!e) return null;
        return e;
    },
    nsfw(message, type) {
        var list = ``;
        message.guild.channels.cache.forEach(channel => {
            if (channel.nsfw) {
                list += channel.toString() + `\n`;
            }
        })
        const embed = client.send.embed()
        if (type) {
            embed
                .setTitle(`NSFW channels for ${message.guild.name}`)
                .setThumbnail(client.util.link.pfp)
                .setDescription(type);
        } else {
            embed
                .setTitle(`***Something went wrong!***`)
                .setThumbnail(client.util.link.error)
                .setColor(client.util.embed.failed)
                .setDescription(`Cannot send possible NSFW content in an SFW channel!`);
        }
        if (list) {
            embed.addField(`Try in one of these channels`, list, false);
        } else {
            embed
                .addField(`Try in one of these channels`, `No NSFW channels found\nEdit Channel > Overview > NSFW - Toggle On`, false)
                .setImage(client.util.link.nsfw);
        }
        return message.channel.send(embed);
    },
    hiro(message, args) {
        if (client.send.approve(message.author.id, `APPROVED`)) {
            if (!args[0]) {
                return false;
            }
            if (args[0].toLowerCase() === `hiro`) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    error(input) {
        const embed = client.send.embed()
            .setColor(client.util.embed.failed)
            .setTitle(input)
        return embed;
    },
    report(message, rawerr, errmsg) {
        if (!rawerr && !errmsg) {
            console.log(message.stack);
            const embed = client.send.embed()
                .setTitle(`***Something went wrong!***`)
                .setThumbnail(client.util.link.error)
                .addField(`Raw Error`, `\`\`\`\n` + rawerr + `\n\`\`\``, false)
            return client.channels.cache.get(client.util.link.error_log).send(embed);
        }
        console.log(rawerr.stack);
        const embed = client.send.embed()
            .setTitle(`***Something went wrong!***`)
        if (errmsg) {
            embed.addField(`Error Reason`, errmsg, false)
        }
        embed
            .addField(`Raw Error`, `\`\`\`\n` + rawerr + `\n\`\`\``, false)
            .addField(`User Information`,
                `User Tag: \`` + message.author.tag + `\`\n` +
                `User ID: \`` + message.author.id + `\`\n` +
                `User Created At: \`` + message.author.createdAt.toDateString() + `\``, false)
            .addField(`Source Command`, message.content, false)
        client.channels.cache.get(client.util.id.error_log).send(embed);
        embed.addField(`Need Support?`, `[Click Here!](` + client.util.link.support + `)`, false).setThumbnail(client.util.link.error).setDescription(`This error has been reported to the devs and will be checked soon!`);
        return message.channel.send(embed);
    },
    process(input) {
        console.log(input)
        const embed = client.send.embed()
            .setTitle(`***Something went wrong!***`)
            .addField(`Raw Error`, `\`\`\`\n` + input.stack + `\n\`\`\``, false)
        return client.channels.cache.get(client.util.id.error_log).send(embed);
    },
    restrict(message, code) {
        var output;
        if (code === 16) {
            output = `To use this command you must be approved by the owners!`
        }
        if (code === 14) {
            output = `To use this command you must be approved by the Devs, Mods, or Gonpachiro users!`
        }
        const embed = client.send.embed()
            .addField(`📥 Input`, `\`\`\`\n${message.content}\n\`\`\``)
            .addField(`📤 Output`, `\`\`\`xl\nERROR: ${output}\n**Code ${code}** \`${client.config.prefix}errcodes <err>\` to view error type\`\`\``)
            .addField(`Status`, `${client.emojis.cache.get(client.util.emoji.red).toString()} - Failed`)
        return message.channel.send(embed);
    },
    disabled(message) {
        const embed = client.send.embed()
            .setTitle(`***Something went wrong!***`)
            .setDescription(`Command currently disabled`)
            .addField(`Need Support?`, `[Click Here!](` + client.util.link.support + `)`, false)
            .setImage(client.util.link.disabled)
        message.channel.send(embed);
        return client.send.log(message, `Disabled`);
    },
    input(message, input, note) {
        const embed = client.send.embed().setTitle(message.guild.members.cache.get(message.author.id).displayName + `,`);
        if (note) {
            embed.setDescription(`You have entered an invalid command, below is the proper way to use it` + `\n` + input + `\n` + `\`` + note + `\``)
        } else {
            embed.setDescription(`You have entered an invalid command, below is the proper way to use it` + `\n` + input)
        }
        embed
            .addField(`If a command does not work or you do not fully understand how to use a command`, `Contact: ${client.util.name.creator}` + `\n` + `Use ${client.config.prefix}support` + `\n` + `**Code 05** \`${client.config.prefix}errcodes <err>\` to view error type`, false)
            .setColor(client.util.embed.failed)
        return message.channel.send(embed);
    },
    help(message, input, note) {
        const embed = client.send.embed().setTitle(message.guild.members.cache.get(message.author.id).displayName + `,`);
        if (note) {
            embed.setDescription(`Below is the proper way to use this command` + `\n` + input + `\n` + `\`` + note + `\``);
        } else {
            embed.setDescription(`Below is the proper way to use this command` + `\n` + input);
        }
        embed
            .addField(`If a command does not work or you do not fully understand how to use a command`, `Contact: ${client.util.name.creator}` + `\n` + `Use ${client.config.prefix}support`, false)
        return message.channel.send(embed);
    },
    perms(message, perm, code) {
        const embed = client.send.embed()
            .setTitle(message.guild.members.cache.get(message.author.id).displayName + `,`)
            .setDescription(`**Code ` + code + `** \`${client.config.prefix}errcodes <err>\` to view error type`)
            .addField(`Permissions`, `You do **NOT** have the \`` + perm + `\` permission!`)
            .addField(`Has permission **` + perm + `**`, `${client.emojis.cache.get(client.util.emoji.cross).toString()} - False`, true)
            .setColor(client.util.embed.failed)
        return message.channel.send(embed);
    },
    missing(message, reason, code) {
        const embed = client.send.embed()
            .setTitle(message.guild.members.cache.get(message.author.id).displayName + `,`)
            .setDescription(`**Code ` + code + `** \`${client.config.prefix}errcodes <err>\` to view error type`)
            .addField(`Reason`, reason, false)
            .setColor(client.util.embed.failed)
        message.channel.send(embed);
        return;
    },
    get(type) {
        type = type.toLowerCase();
        if (type === `contact`) {
            return [`If a command does not work or you do not fully understand how to use a command`, `Contact: ${client.util.name.creator}` + `\n` + `Use ${client.config.prefix}support`, false];
        }
    },
    lines(filePath) {
        let i;
        let count = 0;
        fs.createReadStream(filePath)
            .on('error', e => console.log(e))
            .on('data', chunk => {
                for (i = 0; i < chunk.length; ++i) if (chunk[i] == 10) count++;
            })
            .on('end', () => { lineCount += count; });
        return count;
    },
    clean(input) {
        var original = [`/PREFIX/`, `/BOT/`];
        var replace = [client.config.prefix, client.user.username];
        var num = [8, 5];
        for (var i = 0; i < original.length; i++) {
            while (input.includes(original[i])) {
                let loc = input.indexOf(original[i])
                input = input.substring(0, loc) + replace[i] + input.substring(loc + num[i]);
            }
        }
        return input;
    },
    exists(input) {
        let prefix = input.indexOf(client.config.prefix) || input.indexOf(client.config.back_up),
            loc = input.indexOf(` `),
            message = input.substring(prefix + 2, loc);
        try {
            command = client.commands.get(client.aliases.get(input)).code || client.commands.get(input).code;
        } catch (error) {
            return false;
        }
        if (command) {
            return true;
        } else {
            return false;
        }
    }
};