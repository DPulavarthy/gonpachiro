const { readdirSync } = require("fs");

module.exports = async (client) => {
    let count = 0,
        approved = 0,
        broken = ``,
        lines = 0,
        cmds = 0;
    readdirSync(`./`).forEach(file => {
        let filepath = `./${file}`
        if (file.endsWith(`.js`)) {
            lines += client.send.lines(filepath);
        }
    })
    lines += client.send.lines(`./${require(`../package.json`).main}`);
    lines += client.send.lines(`./send.js`);
    lines += client.send.lines(`./util.js`);
    console.log(`Loading commands!`);
    readdirSync("./commands/").forEach(async dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.split(".").pop() === "js");

        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            let filepath = `./commands/${dir}/${file}`;
            if (pull.code.name) {
                client.commands.set(pull.code.name, pull);
                pull.code.aliases.forEach(alias => {
                    client.aliases.set(alias, pull.code.name);
                });
                count++;
                approved++;
            }
            else {
                count++;
                broken += file + `, `;
                continue;
            }
                lines += client.send.lines(filepath);
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });
    client.send.setCMD(count)
    client.send.setLines(lines + count);
    if (broken) {
        console.log(`Successfully loaded ${approved}/${count} commands, failed to load: ${broken.substring(0, broken.length - 2)}`);
    } else {
        console.log(`Successfully loaded ${approved}/${count} commands`);
    }
}