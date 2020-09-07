const moment = require(`moment`);
require(`moment-duration-format`)(moment);

module.exports.run = async (client, message) => {
    client.database.config.findOne({ case: `logs` }, async function (error, result) {
        if (error) { client.error(error); };
        if (!result) { result = await client.src.db(message, `logs`, null, null, client.database.config); };
        let i = 1, field = [];
        result.data.forEach(log => { field.push(`${i}.) ${log}`); i++; });
        message.channel.send(client.src.code(` --> LOGS START <-- [5 -> latest & 1 -> oldest] Uptime: ${moment.duration(new Date().getTime() - new Date(client.readyAt).getTime()).format(`w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds]`)}\n${field.join(`\n`)}\n ---> LOGS END <--- `));
        return client.log(message);
    })
}

module.exports.code = {
    title: "/hirologs",
    about: "Recent logs",
    usage: ["%P%/hirologs"],
    ranks: 7,
    dm: true,
}