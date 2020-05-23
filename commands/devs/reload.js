let package = require(`../../package.json`);
const { readdirSync } = require("fs");

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!client.send.approve(message.author.id, `DEVELOPER`)) {
        client.send.restrict(message, 14);
        return client.send.log(message, `hiro`);
    } else {
        let input = args.join(" "),
            doing = client.emojis.cache.get(client.util.emoji.loading).toString(),
            done = client.emojis.cache.get(client.util.emoji.check).toString();
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
                    masterReload();
                    return client.send.log(message, `hiro`);
                } else if (groups && groups.includes(input)) {
                    folder = readdirSync(`./commands/${input}/`);
                } else {
                    folder = false;
                }
            } catch (error) {
                console.log(error)
            }
            if (folder) {
                let loading = await message.channel.send(client.send.embed().setTitle(`Reloading ${folder.length} commands`)),
                    i = 0,
                    body = ``;
                folder.forEach(file => {
                    i++;
                    let temp = `${doing} Reloading: ${file}\n`;
                    loading.edit(client.send.embed().setTitle(`Reloading ${i}/${folder.length} commands`).setDescription(`${body}${temp}`));
                    delete require.cache[require.resolve(`../../commands/${input}/${file}`)];
                    client.commands.delete(file.substring(0, file.length - 3));
                    const load = require(`../../commands/${input}/${file}`);
                    client.commands.set(file.substring(0, file.length - 3), load);
                    body += `${done} Reloaded: ${file}\n`;
                    loading.edit(client.send.embed().setTitle(`Reloading ${i}/${folder.length} commands`).setDescription(`${body}Loading${client.emojis.cache.get(client.util.emoji.embed_loading).toString()}`));
                    if (i === folder.length) {
                        loading.edit(client.send.embed().setTitle(`Reloaded ${folder.length} commands`).setDescription(body))
                    }
                })
                return client.send.log(message);
            }
            let command;
            try {
                let main = await mainDIR(input);
                if (main) {
                    message.channel.send(`Cannot reload \`${main}\` because it is not a command file`);
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
                let reloading = `./commands/${command.group}/${name}.js`;
                let loading = await message.channel.send(`${doing} Reloading: \`${reloading}\``);
                delete require.cache[require.resolve(`../.${reloading}`)];
                client.commands.delete(name);
                const load = require(`../.${reloading}`);
                client.commands.set(name, load);
                loading.edit(`${done} Reloaded: \`${reloading}\``)
                return client.send.log(message, `hiro`);
            } else {
                await message.channel.send(`No command found for: ${args.join(" ")}`);
                return client.send.log(message, `hiro`);
            }
        } else {
            masterReload();
            return client.send.log(message, `hiro`);
        }
        function masterReload() {
            message.channel.send(`You are about to reload all ${client.send.getCMD()} commands, reply with ${done} to start the process.`).then(msg => {
                msg.react(client.emojis.cache.get(client.util.emoji.check))

                const approval = (reaction, user) => reaction.emoji.name === client.emojis.cache.get(client.util.emoji.check).name && user.id !== client.user.id && user.id === message.author.id;
                const waitApproval = msg.createReactionCollector(approval, { time: 20 * 1000 });

                waitApproval.on('collect', async () => {
                    msg.delete();
                    let loading = await message.channel.send(client.send.embed().setTitle(`Reloading ${client.send.getCMD()} commands`)),
                        i = 0;
                    readdirSync(`./commands/`).forEach(folder => {
                        readdirSync(`./commands/${folder}/`).forEach(file => {
                            i++;
                            let percent = ((i * 100) / client.send.getCMD()).toFixed(2),
                                bar = Math.round(percent / 10),
                                output = ``;
                            for (let loc = 0; loc < 10; loc++) {
                                if (loc < bar) {
                                    output += client.emojis.cache.get(client.util.emoji.bar_filled).toString();
                                } else {
                                    output += client.emojis.cache.get(client.util.emoji.bar_empty).toString();
                                }
                            }
                            try {
                                loading.edit(client.send.embed().setTitle(`Reloading ${i}/${client.send.getCMD()} commands`).setDescription(`${doing} Reloading: ${file}\n${output}${percent}%`));
                                delete require.cache[require.resolve(`../../commands/${folder}/${file}`)];
                                client.commands.delete(file.substring(0, file.length - 3));
                                const load = require(`../../commands/${folder}/${file}`);
                                client.commands.set(file.substring(0, file.length - 3), load);
                                loading.edit(client.send.embed().setTitle(`Reloading ${i}/${client.send.getCMD()} commands`).setDescription(`Loading${client.emojis.cache.get(client.util.emoji.embed_loading).toString()}\n${output}${percent}%`));
                            } catch (error) {
                                client.send.report(message, error);
                            }
                            if (i === client.send.getCMD()) {
                                setTimeout(function () {
                                    loading.edit(client.send.embed().setTitle(`Reloaded ${client.send.getCMD()} commands`).setDescription(`${done}Reloaded all commands.\n${output}${percent}%`));
                                    client.send.log(message);
                                }, 1000);
                            }
                        })
                    })
                })

                waitApproval.on('end', async () => {
                    msg.delete();
                })
            })
        }
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
        return `./${input}.json`;
    } else if (handler.includes(input)) {
        return `./handler/${input}.js`;
    } else if (main.includes(input)) {
        return `./${package.main}`;
    } else {
        return false;
    }
};

module.exports.code = {
    name: "reload",
    description: "reload command to accept new changes",
    group: "devs",
    usage: ["/PREFIX/reload [COMMAND]"],
    accessableby: "Developers",
    aliases: ["reload"]
}

