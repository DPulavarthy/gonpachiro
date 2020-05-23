module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let loading = await message.channel.send(client.send.loading()),
        codes = [
            `Author permission / Author role error`,
            `Client permission / Client role error`,
            `Connection error`,
            `Command disabled`,
            `Command error`,
            `Channel error/command invalid in channel`,
            `Invalid input / Invalid command`,
            `Code error - Report to support [here](` + client.util.link.support + `)`,
            `Member error / Member does not exist`,
            `Channel does not exist`,
            `Channel already exists`,
            `User/member not mentioned`,
            `Role not mentioned`,
            `DEV ONLY`,
            `Role already given`,
            `OWNER ONLY`
        ];

    if (!args.join(" ") || args.join(" ").toLowerCase() === `all`) {
        await loading.edit(errcodes()).catch(error => { loading.delete(); client.send.report(message, error); });
        return client.send.log(message);
    }
    let code = parseInt(args.join(" "));
    if (code) {
        await loading.edit(getCode(code)).catch(error => { loading.delete(); client.send.report(message, error); });
        return client.send.log(message);
    } else {
        await loading.edit(getCode(`Invalid`)).catch(error => { loading.delete(); client.send.report(message, error); });
        return client.send.log(message);
    }

    function errcodes() {
        const embed = client.send.embed().setTitle(message.guild.members.cache.get(message.author.id).displayName + `,`)
        for (let i = 0; i < codes.length; i++) {
            embed.addField(`Code ` + (i + 1), codes[i], true)
        }
        return embed;
    }

    function getCode(code) {
        try {
            if (code === `Invalid` || !codes[code - 1]) {
                const embed = client.send.embed().setTitle(message.guild.members.cache.get(message.author.id).displayName + `,`)
                embed.addField(`Invalid Code`, `Codes only go from 1 to ${codes.length}`, true)
                return embed;
            } else {
                const embed = client.send.embed().setTitle(message.guild.members.cache.get(message.author.id).displayName + `,`)
                embed.addField(`Code ` + code, codes[code - 1], true)
                return embed;
            }
        } catch (error) {
            const embed = client.send.embed().setTitle(message.guild.members.cache.get(message.author.id).displayName + `,`)
            embed.addField(`Invalid Code`, `Codes only go from 1 to ${codes.length}`, true)
            return embed;
        }
    }
}

module.exports.code = {
    name: "errcodes",
    description: "Error types for /BOT/",
    group: "helpers",
    usage: ["/PREFIX/errcodes (ERROR CODE)"],
    accessableby: "Members",
    aliases: ["err", "errcodes", "errcode", "errorcode", "errorcodes"]
}