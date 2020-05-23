module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (args.length > 10 || args.length < 1) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    } else {
        let group1 = [], group2 = [], max = args.length / 2;
        for (let i = 0; i < args.length; i++) {
            let rand = Math.floor(Math.random() * 2);
            if (rand === 1) {
                group1.push(args[i]);
            } else {
                group2.push(args[i]);
            }
        }
        if (group1.length > args.length / 2) {
            let count = group1.length - args.length / 2;
            for (let i = 0; i < count; i++) {
                group2.push(group1.pop())
            }
        }
        if (group2.length > args.length / 2) {
            let count = group2.length - args.length / 2;
            for (let i = 0; i < count; i++) {
                group1.push(group2.pop())
            }
        }
        let g1 = `**\`Group 1\`**\n`, g2 = `**\`Group 2\`**\n`;
        group1.forEach(arg => {
            g1 += `${client.arrow} ${arg}\n`;
        })
        group2.forEach(arg => {
            g2 += `${client.arrow} ${arg}\n`;
        })
        message.channel.send(client.send.embed().setDescription(`${g1}\n${g2}`))
        return client.send.log(message);
    }
}

module.exports.code = {
    name: "teams",
    description: "Put [ARGS] into 2 teams",
    group: "requests",
    usage: ["/PREFIX/teams [ARGS]"],
    accessableby: "Villagers",
    aliases: ["teams"]
}