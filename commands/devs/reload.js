module.exports.run = async (client, message, args) => {
    let doing = client.emojis.cache.get(client.emoji.loading).toString(), done = client.emojis.cache.get(client.emoji.check).toString();
    switch (!args.join(` `)) {
        case true:
            let list = [];
            for await (let command of client.commands) { list.push(command[1]); }
            let j = 1, i = 1, loading = await message.channel.send(client.embed().setAuthor(`Reloading: ${i}/${list.length} commands`));
            list.forEach(async cmd => {
                setTimeout(async () => {
                    let percent = ((i * 100) / list.length).toFixed(2), bar = Math.round(percent / 10), output = ``;
                    for (let loc = 0; loc < 10; loc++) { if (loc < bar) { output += client.emojis.cache.get(client.emoji.filled).toString(); } else { output += client.emojis.cache.get(client.emoji.empty).toString(); }; };
                    let command = client.commands.get(cmd.code.title), name = command.code.title.startsWith(`/`) ? command.code.title.substring(1) : command.code.title, dir = command.group, reloading = `./commands/${dir}/${name}.js`;
                    loading.edit(client.embed().setAuthor(`Reloading: ${i}/${list.length} commands`).setDescription(`${doing} Reloading: \`${name}.js\`\nLoading${client.emojis.cache.get(client.emoji.processing)}\n${output} ${percent}%`));
                    delete require.cache[require.resolve(`../.${reloading}`)];
                    client.commands.delete(name);
                    const pull = require(`../.${reloading}`);
                    client.commands.set(name, { run: pull.run, code: pull.code, group: dir });
                    i++;
                    setTimeout(async () => {
                        if ((i - 1) < list.length) { loading.edit(client.embed().setAuthor(`Reloading: ${i}/${list.length} commands`).setDescription(`**${done} Reloaded: \`${name}.js\`**\nLoading${client.emojis.cache.get(client.emoji.processing)}\n${output} ${percent}%`)); }
                        else { loading.edit(client.embed().setAuthor(`Reloaded: ${list.length} commands`).setDescription(`${body.join(`\n`)}`)); };
                    }, 1000);
                }, j * 5 * 1000);
                j++;
            })
            client.log(message, `hiro`);
            break;
        default:
            let input = args.join(` `).toLowerCase(), command = client.commands.get(client.aliases.get(input)) || client.commands.get(input) || client.commands.get(client.aliases.get(`?${input}`)) || client.commands.get(`/${input}`);
            if (command) {
                let name = command.code.title.startsWith(`/`) ? command.code.title.substring(1) : command.code.title, dir = command.group, reloading = `./commands/${dir}/${command.code.title}.js`;
                let loading = await message.channel.send(client.embed().setDescription(`**${doing} Reloading: \`${reloading}\`**`));
                delete require.cache[require.resolve(`../.${reloading}`)];
                client.commands.delete(name);
                const pull = require(`../.${reloading}`);
                client.commands.set(name, { run: pull.run, code: pull.code, group: dir });
                loading.edit(client.embed().setDescription(`**${done} Reloading: \`${reloading}\`**`));
                return client.log(message, `hiro`);
            } else {
                let groups = [], reload = [], i = 1, j = 1;
                client.commands.forEach(command => { if (!groups.includes(command.group)) { groups.push(command.group); }; });
                if (groups.includes(input)) {
                    client.commands.forEach(command => { if (command.group === input && !reload.includes(command.code.title)) { reload.push(command.code.title); }; });
                    let loading = await message.channel.send(client.embed().setAuthor(`Reloading: ${i}/${reload.length} commands`)), body = [];
                    for await (let cmd of reload) {
                        setTimeout(async () => {
                            let command = client.commands.get(cmd), name = command.code.title.startsWith(`/`) ? command.code.title.substring(1) : command.code.title, reloading = `./commands/${input}/${name}.js`;
                            body.push(`${doing} Reloading: \`${name}.js\``);
                            loading.edit(client.embed().setAuthor(`Reloading: ${i}/${reload.length} commands`).setDescription(body.join(`\n`)));
                            delete require.cache[require.resolve(`../.${reloading}`)];
                            client.commands.delete(name);
                            const pull = require(`../.${reloading}`);
                            client.commands.set(name, { run: pull.run, code: pull.code, group: input });
                            body.pop();
                            body.push(`**${done} Reloaded: \`${name}.js\`**`)
                            i++;
                            setTimeout(async () => {
                                if ((i - 1) < reload.length) { loading.edit(client.embed().setAuthor(`Reloading: ${i}/${reload.length} commands`).setDescription(`${body.join(`\n`)}\nLoading${client.emojis.cache.get(client.emoji.processing)}`)); }
                                else { loading.edit(client.embed().setAuthor(`Reloaded: ${reload.length} commands`).setDescription(`${body.join(`\n`)}`)); };
                            }, 1000);
                        }, j * 5 * 1000);
                        j++;
                    }
                    client.log(message, `hiro`);
                } else { message.channel.send(client.src.comment(`That command file or group does not exist.`)); client.log(message, `hiro`); };
            }
            return;
    }
}

module.exports.code = {
    title: "reload",
    about: "reload command to accept new changes",
    usage: ["%P%reload [COMMAND]"],
    ranks: 7,
    dm: true,
}