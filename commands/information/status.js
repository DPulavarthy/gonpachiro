const agent = require(`superagent`);

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (args.join(" ")) {

        if (!client.send.approve(message.author.id, `APPROVED`)) {
            client.send.restrict(message, 14);
            return client.send.log(message, `hiro`);
        } else {
            if (args[0].toLowerCase() === `toggle`) {
                if (args[1].toLowerCase() === `off` || args[1].toLowerCase() === `down`) {
                    let reason = args.slice(2).join(" ");
                    client.send.down(reason);
                    await message.react(client.emojis.cache.get(client.util.emoji.check))
                } else if (args[1].toLowerCase() === `on` || args[1].toLowerCase() === `up`) {
                    client.send.up();
                    await message.react(client.emojis.cache.get(client.util.emoji.check))
                }
            } else {
                await message.react(client.emojis.cache.get(client.util.emoji.cross))
                return client.send.log(message, `hiro`);
            }
        }
    } else {
        let se = {
            "green": client.emojis.cache.get(client.util.emoji.green),
            "yellow": client.emojis.cache.get(client.util.emoji.yellow),
            "red": client.emojis.cache.get(client.util.emoji.red)
        }

        const heroku = await agent.get(`https://status.heroku.com/api/v4/current-status`).catch(err => { return { body: null } });
        let discord = await agent.get(`https://srhpyqt94yxb.statuspage.io/api/v2/status.json`).catch(err => { return { body: null } }),
            cloudflare = await agent.get("https://yh6f0r4529hb.statuspage.io/api/v2/status.json").catch(err => { return { body: null } }),
            github = await agent.get("https://kctbh9vrtdwd.statuspage.io/api/v2/status.json").catch(err => { return { body: null } }),
            twitter = await agent.get("https://zjttvm6ql9lp.statuspage.io/api/v2/status.json").catch(err => { return { body: null } }),
            ifttt = await agent.get("https://b8h007xb5lsy.statuspage.io/api/v2/status.json").catch(err => { return { body: null } }),
            appstatus = heroku.body.status.find(c => (c.system || "").toLowerCase().includes("apps"));
        let status = `${client.emojis.cache.get(client.util.emoji.green).toString()} **[${client.user.username}:](${client.util.link.invite})** All Systems Operational\n`;
        if (client.send.maintenance()) {
            status = `${client.emojis.cache.get(client.util.emoji.red).toString()} **[${client.user.username}:](${client.util.link.invite})** ${client.send.maintenance(`reason`)}\n`;
        }


        status += `${getstatus(discord.body.status, `Discord`, `https://status.discordapp.com/`)}\n`;
        status += `${getstatus(github.body.status, `Github`, `https://www.githubstatus.com/`)}\n`;
        status += `${getstatus(cloudflare.body.status, `Cloudflare`, `https://www.cloudflarestatus.com/`)}\n`;
        status += `${getstatus(twitter.body.status, `Twitter`, `https://status.twitterstat.us/`)}\n`;
        status += `${getstatus(ifttt.body.status, `IFTTT`, `https://status.ifttt.com/`)}\n`;
        status += getstatus(`heroku`);

        await message.channel.send(client.send.embed().addField(`Connections`, status, true));
        return client.send.log(message);


        function getstatus(input, name, link) {
            if (input === `heroku`) {
                let count = 0;
                heroku.body.status.map(s => {
                    if (s.status === `green`) {
                        count++;
                    }
                });
                let herokuStatus;
                if (count === 3) {
                    herokuStatus = client.emojis.cache.get(client.util.emoji.green).toString();
                }
                else if (count === 2) {
                    herokuStatus = client.emojis.cache.get(client.util.emoji.yellow).toString();
                }
                else if (count === 1) {
                    herokuStatus = client.emojis.cache.get(client.util.emoji.red).toString();
                }
                else {
                    herokuStatus = ``;
                }
                return herokuStatus += ` **[Heroku](https://status.heroku.com/)**\n` + heroku.body.status.map(s => `${client.emojis.cache.get(client.util.emoji.right_arrow)}${se[s.status]} ${s.system}`).join(`\n`) + `\n`;
            } else {
                let status = input.indicator === "none" ? client.emojis.cache.get(client.util.emoji.green) : client.emojis.cache.get(client.util.emoji.red);
                if (input.description.toLowerCase().includes(`minor`) || input.description.toLowerCase().includes(`general`)) {
                    status = client.emojis.cache.get(client.util.emoji.yellow);
                }
                return `${status} **[${name}:](${link}) ** ${input.description}`
            }
        }

    }
}


module.exports.code = {
    name: "status",
    description: "Current status of client",
    group: "information",
    usage: ["/PREFIX/status"],
    accessableby: "Villagers",
    aliases: ["stat", "status"]
}