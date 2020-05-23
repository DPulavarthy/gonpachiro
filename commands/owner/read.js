const fs = require("fs")
let package = require(`../../package.json`);
const { readdirSync } = require("fs");

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!client.send.approve(message.author.id, `APPROVED`)) {
        client.send.restrict(message, 14);
        return client.send.log(message, `hiro`);
    } else {
        let input = args.join(" ");
        if (input) {
            if (input.includes(`config`) || input.includes(`util`)) {
                const embed = client.send.embed()
                    .addField(`?? Input`, `\`\`\`\n${input}\n\`\`\``)
                    .addField(`?? Output`, `\`\`\`xl\nERROR: You do not want to do this!\nA word has triggered the eval command to terminate!\`\`\``)
                    .addField(`Status`, `${client.emojis.cache.get(client.util.emoji.red).toString()} - Failed`);
                await message.channel.send(embed);
                return client.send.log(message, `hiro`);

            }
            let loc = input.lastIndexOf(`.`);
            if (loc) {
                let check = input.substring(loc + 1);
                if (check === `js` || check === `json`) {
                    input = input.substring(0, loc);
                }
            }
            let folder;
            try {
                let groups = [];
                readdirSync(`./commands/`).forEach(file => {
                    groups.push(file);
                })
                if (input === `main`) {
                    folder = readdirSync(`./`);
                } else if (input === `commands` || input === `cmds`) {
                    folder = readdirSync(`./commands/`);
                } else if (groups && groups.includes(input)) {
                    folder = readdirSync(`./commands/${input}/`);
                } else {
                    folder = false;
                }
            } catch (error) {
                console.log(error)
            }
            if (folder) {
                let names = ``,
                    i = 0;
                folder.forEach(file => {
                    i++;
                    names += `\`${i}.)\` ${file}\n`;
                })
                if (!names) {
                    names = `No files found`
                }
                await message.channel.send(names);
                return client.send.log(message);
            }
            let command;
            try {
                let main = await mainDIR(input);
                if (main) {
                    readFile(`${main}`);
                    return client.send.log(message, `hiro`);
                } else {
                    command = client.commands.get(client.aliases.get(input)).code || client.commands.get(input).code;
                }
            } catch (error) {
                await message.channel.send(`No command found: ${error}`);
                return client.send.log(message, `hiro`);
            }
            if (command) {
                let name = command.name;
                if (name.startsWith(`/`)) {
                    name = name.substring(1);
                }
                readFile(`./commands/${command.group}/${name}.js`);
                return client.send.log(message, `hiro`);
            } else {
                await message.channel.send(`No command found for: ${args.join(" ")}`);
                return client.send.log(message, `hiro`);
            }
        } else {
            await message.channel.send(`No input provided`);
            return client.send.log(message, `hiro`);
        }
    }

    async function mainDIR(input) {
        let js = [],
            json = [],
            main = [package.main.substring(0, package.main.length - 3), `index`],
            handler = [`command`];
        readdirSync(`./`).forEach(file => {
            if (file.endsWith(`.js`)) {
                js.push(file.substring(0, file.length - 3));
            } else if (file.endsWith(`.json`)) {
                json.push(file.substring(0, file.length - 5))
            }
        })
        if (js.includes(input)) {
            return `./${input}.js`;
        } else if (json.includes(input)) {
            return `./${input}.json`
        } else if (handler.includes(input)) {
            return `./handler/${input}.js`
        } else if (main.includes(input)) {
            return `./${package.main}`
        } else {
            return false;
        }
    }

    function readFile(path) {
        fs.readFile(path, async (err, data) => {
            try {
                if (((data || "").length + 100) > 2000) {
                    let bin = await client.bin(client, data.toString());
                    message.channel.send(client.send.embed().setDescription(`Output was larger than 2000 character, transferred to [pastebin](${bin}). While you steal my code, check out [MarksBot](https://top.gg/bot/417143274713776139)`))
                    return client.send.log(message, `hiro`);
                }
                let format;
                if (err) message.channel.send(`Failed! Error: \`\`\`${err}\`\`\``);
                if (path.endsWith(`.js`)) {
                    format = `js`;
                } else {
                    format = `json`;
                }
                message.channel.send(`\`\`\`${format}\n${data}\`\`\``).catch(error => client.send.report(message, error));
                return client.send.log(message, `hiro`);
            } catch (error) {
                message.channel.send(`**${err.name}: ${err.message}**`);
                return client.send.log(message, `hiro`);
            }
        });
    }
}

module.exports.code = {
    name: "read",
    description: "Sends the file at [FILEPATH]",
    group: "owner",
    usage: ["/PREFIX/read [FILEPATH]"],
    accessableby: "Owners",
    aliases: ["read"]
}