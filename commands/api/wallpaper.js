module.exports.run = async (client, message, args) => {
    const nekos = require('nekos.life');
    const neko = new nekos();
    neko.sfw.wallpaper().then(gif => { message.channel.send(client.embed().setImage(gif.url)); return client.log(message); });
}

module.exports.code = {
    title: "wallpaper",
    about: "A wallpaper command",
    usage: ["%P%poke (USER)"],
    alias: ["wp"],
    nsfw: false,
}