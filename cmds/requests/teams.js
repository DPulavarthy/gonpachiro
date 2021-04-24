module.exports.run = async (client, message, args, prefix) => {
    if (args.length > 10 || args.length < 1) { return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    let group1 = [], group2 = [];
    for (let i = 0; i < args.length; i++) { let rand = Math.floor(Math.random() * 2); rand === 1 ? group1.push(args[i]) : group2.push(args[i]); };
    if (group1.length > args.length / 2) { let count = group1.length - args.length / 2; for (let i = 0; i < count; i++) { group2.push(group1.pop()); }; };
    if (group2.length > args.length / 2) { let count = group2.length - args.length / 2; for (let i = 0; i < count; i++) { group1.push(group2.pop()); }; };
    let g1 = `**\`Group 1\`**\n`, g2 = `**\`Group 2\`**\n`;
    group1.forEach(arg => { g1 += `${client.arrow} ${arg}\n`; });
    group2.forEach(arg => { g2 += `${client.arrow} ${arg}\n`; });
    message.channel.send(client.embed().setDescription(`${g1}\n${g2}`))
    return client.log(message);
}

module.exports.code = {
    title: "teams",
    about: "Put [ARGS] into 2 teams.\n[ARGS] = list of items greater than 0 item and less than 11",
    usage: ["%P%teams [ARGS]"],
    dm: true,
}