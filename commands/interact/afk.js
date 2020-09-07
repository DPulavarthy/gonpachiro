let moment = require("moment"), momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

module.exports.run = async (client, message, args, prefix, system) => {
    if (args.join(` `) && args.join(` `).toUpperCase() === `END`) { // End AFK
        client.database.data.findOne({ case: module.exports.code.title }, async function (error, result) {
            if (error) { client.error(error); };
            if (!result) { return client.src.db(message, module.exports.code.title); };
            let status = result.data.find(user => user.auth === message.author.id), field = [];
            if (status) {
                field.push(`${client.arrow} User: ${message.author.tag}`);
                field.push(`${client.arrow} ID: ${message.author.id}`);
                field.push(`${client.arrow} Duration: ${moment.duration(new Date().getTime() - status.time).format(`w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds]`)}`);
                field.push(`${client.arrow} Reason: ${status.data}`);
                field.push(`${client.arrow} Locked: ${status.lock ? `Yes` : `No`}`);
                result.data = result.data.filter(user => user.auth !== message.author.id);
                let msg = await message.channel.send(client.embed().setTitle(`AFK status ended`).setDescription(field.join(`\n`))), res = { $set: { data: result.data } };
                client.database.data.updateOne({ case: module.exports.code.title }, res, function (error) { if (error) { client.src.error(error); }; });
                setTimeout(async () => { msg.delete(); }, 15 * 1000);
                if (!system) { client.log(message); };
            } else {
                message.channel.send(client.src.comment(`You are not currently AFK, use \'${prefix}${module.exports.code.title}\' to start your AFK status, \'${prefix}explain ${module.exports.code.title}\' for more information.`));
                message.react(client.emojis.cache.get(client.emoji.cross));
                return client.log(message);
            }
        })
    } else { // Start AFK
        client.database.data.findOne({ case: module.exports.code.title }, async function (error, result) {
            if (error) { client.error(error); };
            if (!result) { return client.src.db(message, module.exports.code.title); };
            for (let i = 0; i < result.data.length; i++) {
                let status = result.data[i];
                if (status.auth === message.author.id) {
                    message.channel.send(client.src.comment(`You are currently AFK, use \'${prefix}${module.exports.code.title} end\' to end your AFK status, \'${prefix}explain ${module.exports.code.title}\' for more information.`));
                    message.react(client.emojis.cache.get(client.emoji.cross));
                    return client.log(message);
                }
            }
            let field = { lock: false, auth: message.author.id, time: new Date().getTime(), data: `N/A`, };
            field.lock = args[0] && args[0].toUpperCase() === `-LOCK` ? true : false;
            field.data = field.lock ? `${args.splice(1).join(` `) || `N/A`}` : `${args.join(` `) || `N/A`}`
            result.data.push(field);
            let res = { $set: { data: result.data } };
            client.database.data.updateOne({ case: module.exports.code.title }, res, function (error) {
                if (error) { client.src.error(error); message.react(client.emojis.cache.get(client.emoji.cross)); }
                else { message.react(client.emojis.cache.get(client.emoji.check)); return client.log(message); }
            });
        });
    };
}

module.exports.code = {
    title: "afk",
    about: "Set an AFK status, lock = keep AFK status even if you send a message",
    usage: ["%P%afk (-lock) (reason)", "%P%afk end"],
    dm: true,
}