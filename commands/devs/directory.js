module.exports.run = async (client, message, args, prefix) => {
    if (!args.join(` `)) { loading.delete(); return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); };
    let input = args.join(` `).toLowerCase(), package = require(`../../package.json`);
    if (input.startsWith(client.prefix) || input.startsWith(prefix)) { input = input.substring(2); };
    let command = client.commands.get(client.aliases.get(input)) || client.commands.get(input) || client.commands.get(client.aliases.get(`/${input}`)) || client.commands.get(`/${input}`);
    if (command) { embed(`./commands/${command.group}/${command.code.title.startsWith(`/`) ? command.code.title.substring(1) : command.code.title}.js`); return client.log(message); }
    else {
        const resources = require(`fs`).readdirSync(`./resources`).filter(file => file.split(`.`).pop() === `js`);
        if (resources.includes(`${input}.js`)) { embed(`./resources/${input}.js`); return client.log(message); }
        else if (input === `command`) { embed(`./handler/command.js`); return client.log(message); }
        else if ([package.main.substring(0, package.main.length - 3), `index`].includes(input)) { embed(`./${package.main}`); return client.log(message); }
        else {
            let groups = [], field = [], i = 1;
            client.commands.forEach(command => { if (!groups.includes(command.group)) { groups.push(command.group); }; });
            if (groups.includes(input)) { client.commands.forEach(command => { if (command.group === input) { field.push(`\`${i}.)\` ${command.code.title.startsWith(`/`) ? command.code.title.substring(1) : command.code.title}.js`); i++; }; }); message.channel.send(client.embed().setAuthor(`Commands in the ${input} group`).setDescription(field.join(`\n`))); return client.log(message); }
            else { message.channel.send(client.src.comment(`ERROR: That JS file was not found in any directory.`)); return client.log(message); };
        };
    };
    function embed(dir) { return message.channel.send(client.embed().setAuthor(`The directory for \`${args.join(` `)}\` is`).setTitle(`**\`${dir}\`**`)); };
}

module.exports.code = {
    title: "directory",
    about: "Get the directoy of a file/command",
    usage: ["%P%directory [COMMAND/FILE]"],
    alias: ["dir"],
    ranks: 7,
    dm: true,
}