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
                    await message.channel.send(main);
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
                message.channel.send(`The directory for \`${args.join(" ")}\` is: \`./commands/${command.group || "No Group"}/${name}.js\``);
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
            return `The directory for \`${args.join(" ")}\` is: \`./${input}.js\``;
        } else if (json.includes(input)) {
            return `The directory for \`${args.join(" ")}\` is: \`./${input}.json\``
        } else if (handler.includes(input)) {
            return `The directory for \`${args.join(" ")}\` is: \`./handler/${input}.js\``
        } else if (main.includes(input)) {
            return `The directory for \`${args.join(" ")}\` is: \`./${package.main}\``
        } else {
            return false;
        }
    }
}

module.exports.code = {
    name: "directory",
    description: "Get the directoy of a file/command",
    group: "devs",
    usage: ["/PREFIX/directory [COMMAND/FILE]"],
    accessableby: "Gonpachiro",
    aliases: ["directory", "direct", "dir"]
}