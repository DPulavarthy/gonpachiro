module.exports.run = async (client, message) => {
    let status = [client.src.status(true)], ping = require(`ping`);
    ping.sys.probe(`jonin.gq`, async function (running) {
        status.push(running ? `${client.emojis.cache.get(client.emoji.green).toString()} **[Website:](${client.util.link.webstat})** All Systems Operational` : `${client.emojis.cache.get(client.emoji.red).toString()} **[Website:](${client.util.link.webstat})** Currently Down`);
        for await (const link of [`srhpyqt94yxb`, `83dz7syz0j3x`, `kctbh9vrtdwd`, `zjttvm6ql9lp`, `b8h007xb5lsy`, `2kbc0d48tv3j`]) {
            let { body } = await require(`superagent`).get(`https://${link}.statuspage.io/api/v2/status.json`).catch(() => { client.error(error) });
            if (body) { status.push(`${getstatus(body.status, `${body.page.name.substring(0, 1).toUpperCase()}${body.page.name.substring(1)}`, body.page.url)}`); };
        }
        message.channel.send(client.embed().setDescription(status.length === 0 ? `**I was unable to fetch any status pages.**` : `**Connections**\n${status.join(`\n`)}`));
        return client.log(message);
    });
    function getstatus(input, name, link) { return `${input.indicator === `none` ? client.emojis.cache.get(client.emoji.green).toString() : input.description.toLowerCase().includes(`minor`) ? client.emojis.cache.get(client.emoji.yellow).toString() : client.emojis.cache.get(client.emoji.red).toString()} **[${name}:](${link})** ${input.description}`; };
}

module.exports.code = {
    title: "status",
    about: "Current status of client",
    usage: ["%P%status"],
    dm: true,
}