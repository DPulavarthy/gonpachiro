const moment = require(`moment`);
require(`moment-duration-format`)(moment);

module.exports.run = async (client, message) => {
    message.channel.send(client.src.embed().setTitle(`${moment.duration(new Date().getTime() - new Date(client.readyAt).getTime()).format("w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds]")}`));
    return client.src.log(message);
}

module.exports.code = {
    title: "uptime",
    about: "Uptime of %B%",
    usage: ["%P%uptime", "%P%up"],
    alias: ["up"],
    dm: true,
}