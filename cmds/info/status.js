module.exports.run = async (client, message) => {
    let status = [getstatus({ indicator: client.broken || `none`, description: client.broken || `All Systems Operational`}, client.user.tag, null)]
    for await (let link of [`srhpyqt94yxb`, `83dz7syz0j3x`, `kctbh9vrtdwd`, `zjttvm6ql9lp`, `b8h007xb5lsy`, `2kbc0d48tv3j`]) {
        let data = await require(`node-fetch`)(`https://${link}.statuspage.io/api/v2/status.json`);
        let body = await data.json();
        status.push(getstatus(body.status, `${body.page.name.substring(0, 1).toUpperCase()}${body.page.name.substring(1)}`, body.page.url))
    }
    return message.channel.send(client.embed().setDescription(status))
    function getstatus(input, name, link) {
        return `**[\`${input.indicator === `none` ? String.fromCodePoint(128994) : input.description.toLowerCase().includes(`minor`) ? String.fromCodePoint(128993) : String.fromCodePoint(128308)} ${name}:\`](${link})** ${input.description}`
    }
}

module.exports.code = {
    title: "status",
    about: "Current status of client",
    usage: ["%P%status"]
}