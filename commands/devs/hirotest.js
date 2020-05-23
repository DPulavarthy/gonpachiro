module.exports.run = async (client, message) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!client.send.approve(message.author.id, `APPROVED`)) {
        client.send.restrict(message, 14);
        return client.send.log(message, `hiro`);
    } else {
        message.channel.send(`No commands are currently being tested`)
        return client.send.log(message, `hiro`);
    }
    /*
    const applyText = (canvas, text) => {
        const ctx = canvas.getContext('2d');
        let fontSize = 70;

        do {
            ctx.font = `${fontSize -= 10}px sans-serif`;
        } while (ctx.measureText(text).width > canvas.width - 300);

        return ctx.font;
    };

    const canvas = Canvas.createCanvas(1280, 720);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('https://i.imgur.com/porteVD.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = '54px Varela Round';
    ctx.fillStyle = '#ffffff';

    ctx.font = applyText(canvas, `${message.author.username}!`);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Name: ${message.author.username}`, 25, 350);
    ctx.fillText(`Join Rank: ${getJoinRank(message.author.id, message.guild)}`, 25, 450);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'png' }));
    ctx.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

    message.channel.send(`\u200b`, attachment);

    function getJoinRank(ID, guild) {
        let arr = guild.members.cache.array();
        arr.sort((a, b) => a.joinedAt - b.joinedAt);
        let pos = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == ID) pos = i + 1;
        }
        if (pos % 10 === 1 && pos != 11) {
            pos = pos.toString() + `st`;
        } else if (pos % 10 == 2 && pos != 12) {
            pos = pos.toString() + `nd`;
        } else if (pos % 10 == 3 && pos != 13) {
            pos = pos.toString() + `rd`;
        } else {
            pos = pos.toString() + `th`;
        }
        return pos;
    }
    */
}

module.exports.code = {
    name: "/hirotest",
    description: "Command in testing",
    group: "devs",
    usage: ["/PREFIX//hirofix"],
    accessableby: "Gonpachiro",
    aliases: ["/hirotest", "/ht"]
}