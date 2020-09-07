module.exports.run = async (client, message, args, prefix) => {
    switch (!args.join(` `)) {
        case true: client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); break;
        default:
            let input = args.join(` `).toLowerCase(), command = client.commands.get(client.aliases.get(input)) || client.commands.get(input) || client.commands.get(client.aliases.get(`?${input}`)) || client.commands.get(`/${input}`);
            if (command) {
                require(`fs`).readFile(`./commands/${command.group}/${command.code.title.startsWith(`/`) ? command.code.title.substring(1) : command.code.title.substring()}.js`, async (error, data) => {
                    if (error) { message.channel.send(client.src.comment(`Failed! ERROR: ${error}`)); return client.log(message); };
                    try {
                        if (((data || ``).length + 100) > 2000) {
                            let bin = await client.bin(data.toString());
                            message.channel.send(client.embed().setDescription(`Output was larger than 2000 character, transferred to [pastebin](${bin}). While you steal my code, check out [MarksBot](https://top.gg/bot/417143274713776139)`))
                            return client.log(message, `hiro`);
                        }
                        message.channel.send(client.src.code(data, `js`));
                        return client.log(message, `hiro`);
                    } catch (error) { client.error(error); message.channel.send(client.src.comment(`ERROR: ${error}`)); return client.log(message, `hiro`); };
                })
            } else { message.channel.send(client.src.comment(`ERROR: A command file with the title \'${args.join(` `)}\' was not found.`)); return client.log(message, `hiro`); };
    }
}

module.exports.code = {
    title: "read",
    about: "Sends the code for a command",
    usage: ["%P%read command name"],
    ranks: 7,
}