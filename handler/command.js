let Discord = require(`discord.js`);

module.exports = async (client) => { // Command Handler
    let count = 0, approved = 0, lines = 0, length = 0, broken = [], groups = [];
    console.log(`[SYSTEM]: Loading Resources!`.brightGreen);
    for (let main of [`./resources/`, `./handler/`, `./`]) { for (let file of require(`fs`).readdirSync(main).filter(file => file.split(`.`).pop() === `js`)) { require(`fs`).readFile(`${main}${file}`, `utf8`, function (error, code) { if (error) { client.error(error); } length += code.length; lines += countlines(code); }); }; };
    console.log(`[SYSTEM]: Successfully Loaded Resources!`.brightGreen);
    console.log(`[SYSTEM]: Loading Commands!`.brightGreen);
    require(`fs`).readdirSync(`./commands/`).forEach(async dir => {
        const commands = require(`fs`).readdirSync(`./commands/${dir}/`).filter(file => file.split(`.`).pop() === `js`);
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            require(`fs`).readFile(`./commands/${dir}/${file}`, `utf8`, function (error, code) { if (error) { client.error(error); } length += code.length; lines += countlines(code); });
            if (pull.code && pull.code.title) {
                client.cooldowns.set(pull.code.title, new Discord.Collection());
                client.commands.set(pull.code.title, { run: pull.run, code: pull.code, group: dir });
                if (pull.code.alias && pull.code.alias.length > 0) { pull.code.alias.forEach(alias => { client.aliases.set(alias, pull.code.title); }); };
                count++; approved++;
            } else { count++; broken.push(file); continue; };
        }
        groups.push(dir);
    });
    setTimeout(function () { client.lines = lines; client.length = length; client.groups = groups; }, 1000); // Lines of code as well as number of characters
    console.log(`${`[SYSTEM]: Successfully Loaded ${approved}/${count} Commands!`.brightGreen}${broken.length > 0 ? `\n[ERROR!]: Failed To Load: ${broken.join(`, `)}`.red : ``}`);
    function countlines(input) { let stats = require('sloc')(input, `js`); return stats[`total`]; };
}