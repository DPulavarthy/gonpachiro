const fs = require('fs');
const moment = require("moment");
const momentDurationFormatSetup = require("moment-duration-format");

momentDurationFormatSetup(moment);

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }
    if (message.guild.id !== require(`../../queue.json`).id) { return message.reply(`This command is not avaliabe for this server`); }

    fs.readFile('./queue.json', 'utf-8', async function (err, data) {
        if (err) throw err

        let sune = JSON.parse(data),
            queue = sune.queue,
            time = sune.time,
            reason = sune.reason,
            input = message.author,
            sub = args.join(" ") || `No reason`,
            messageArray = message.content.split(" "),
            cmd = messageArray[0].toLowerCase(),
            direct = cmd.slice(client.config.prefix.length);

        if (direct === `join`) {
            if (queue.includes(input.id)) {
                let loc = queue.indexOf(input.id);
                message.react(client.emojis.cache.get(client.util.emoji.cross));
                return message.reply(`Du er allerede i kÃ¸en og er nr ${loc + 1}`)
            } else {
                queue.push(message.author.id);
                time.push(new Date());
                reason.push(sub);
                message.react(client.emojis.cache.get(client.util.emoji.check));
		let field = ``,
                    i = 0;
                queue.forEach(user => {
                    field += `\`${i + 1}.)\`${client.users.cache.get(user).toString()} for ${moment.duration(new Date().getTime() - new Date(time[i]).getTime()).format("h [hrs], m [min], s [sec]")} \`${reason[i] || `No reason`}\`\n`;
                    i++;
                    if (i === 5) {
                        field += `og ${queue.length - 5} andre i køen`;
                    }
                })
                const embed = client.send.embed()
                    .setFooter(`For at joine køen skriv s.join. Har du alligevel ikke brug for hjælp, så skriv s.slut`)
                    .setTitle(`Nuværende kø`)
                    .setDescription(field)
                let body = await message.channel.send(embed);
                setTimeout(function () {
                    body.delete();
                }, 300000);
                fs.writeFile('./queue.json', JSON.stringify(sune, null, 4), function (err) {
                    if (err) {
                        console.log('Error writing file', err)
                    }
                })
            }
        } else if (direct === `slut`) {
            if (queue.includes(input.id)) {
                let loc = queue.indexOf(input.id);
                sune.queue = queue.filter(m => m != queue[loc]);
                sune.time = time.filter(m => m != time[loc]);
                sune.reason = reason.filter(m => m != reason[loc]);

                message.react(client.emojis.cache.get(client.util.emoji.check));
                fs.writeFile('./queue.json', JSON.stringify(sune, null, 4), function (err) {
                    if (err) {
                        console.log('Error writing file', err)
                    }
                });
            } else {
                message.react(client.emojis.cache.get(client.util.emoji.cross));
                return message.reply(`Du er ikke i kÃ¸en`)
            }
        } else if (direct === `inq`) {
            if (queue.length < 1) {
                return message.channel.send(`Ingen i kÃ¸`)
            }
            let field = ``,
                i = 0;
            queue.forEach(user => {
                field += `\`${i + 1}.)\`${client.users.cache.get(user).toString()} for ${moment.duration(new Date().getTime() - new Date(time[i]).getTime()).format("h [hrs], m [min], s [sec]")} \`${reason[i] || `No reason`}\`\n`;
                i++;
                if (i === 5) {
                    field += `og ${queue.length - 5} andre i kÃ¸en`;
                }
            })
            const embed = client.send.embed()
                .setFooter(`For at joine køen skriv s.join. Har du alligevel ikke brug for hjælp, så skriv s.slut`)
                .setTitle(`NuvÃ¦rende kÃ¸`)
                .setDescription(field)
            let body = await message.channel.send(embed);
            setTimeout(function () {
                body.delete();
            }, 300000);
        } else if (direct === `next`) {
            if (message.author.id !== sune.master) {
                return message.reply(`Du har ikke tilladelse til at bruge den kommando`)
            } else {
                if (queue.length < 1) return message.reply(`No queue`)
                let msg = `${client.users.cache.get(queue[0]).toString()} er den nÃ¦ste i kÃ¸en`;
                if (reason[0] !== `No reason`) {
                    msg += `: ${reason[0]}`;
                }
                message.channel.send(msg);
                queue.shift();
                time.shift();
                reason.shift();
                message.react(client.emojis.cache.get(client.util.emoji.check));
                fs.writeFile('./queue.json', JSON.stringify(sune, null, 4), function (err) {
                    if (err) {
                        console.log('Error writing file', err)
                    }
                })
            }
        } else if (direct === `fjern`) {
            if (message.author.id !== sune.master) {
                return message.reply(`Du har ikke tilladelse til at bruge den kommando`)
            } else {
                let index = messageArray[1] - 1;

                sune.queue = queue.filter(m => m != queue[index]);
                sune.time = time.filter(m => m != time[index]);
                sune.reason = reason.filter(m => m != reason[index]);

                message.react(client.emojis.cache.get(client.util.emoji.check));
                fs.writeFile('./queue.json', JSON.stringify(sune, null, 4), function (err) {
                    if (err) {
                        console.log('Error writing file', err)
                    }
                });
            }
        } else if (direct === `list`) {
            let field = ``;
            module.exports.code.aliases.forEach(use => {
                field += `s.${use}\n`;
            })
            let body = await message.channel.send(client.send.embed().setDescription(field).setFooter(`For at joine køen skriv s.join. Har du alligevel ikke brug for hjælp, så skriv s.slut`));
            setTimeout(function () {
                body.delete();
            }, 300000);
        } else if (direct === `sune`) {
	     return message.reply("This command was made for Sune, a simple queue command for a personal server");
	}
    })
}

module.exports.code = {
    name: "sune",
    description: "Queue command",
    group: "requests",
    usage: ["/PREFIX/join"],
    accessableby: "Villagers",
    aliases: ["join", "slut", "inq", "next", "fjern"]
}