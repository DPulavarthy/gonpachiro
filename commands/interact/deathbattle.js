const Canvas = require('canvas');
const Discord = require(`discord.js`);

module.exports.run = async (client, message, args) => {
    let attachment, loading = await message.channel.send(client.src.loading()), user = await client.src.userlist(message, args);
    if (user.length < 1) { user1 = await client.users.cache.get(message.author.id); user2 = await client.users.cache.get(message.author.id); }
    else if (user.length === 1) { user1 = await client.users.cache.get(user[0].id); user2 = await client.users.cache.get(message.author.id); };

    if (!user1 || !user2) { loading.delete(); message.channel.send(client.src.comment(`Looks like one of those users isn't mentioned properly\nPlease mention a user.`)); return client.src.log(message); };
    let member1 = message.guild.members.cache.get(user1.id) || false;
    let member2 = message.guild.members.cache.get(user2.id) || false;
    if (!member1 || !member2) { loading.delete(); message.channel.send(client.src.comment(`Looks like one of those users isn't in this server\nPlease mention a user that is in this server.`)); return client.src.log(message); }
    member1 = member1.displayName;
    member2 = member2.displayName;

    const write = (canvas, text) => {
        let ctx = canvas.getContext('2d'), fontSize = 70;
        do {
            ctx.font = `${fontSize -= 10}px sans-serif`;
            ctx.textAlign = 'center'
        } while (ctx.measureText(text).width > 210);
        return ctx.font;
    };
    try {
        let canvas = Canvas.createCanvas(1386, 768), ctx = canvas.getContext('2d');
        const author = await Canvas.loadImage(user1.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }));
        const avatar = await Canvas.loadImage(user2.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }));
        ctx.drawImage(author, 78, 200, 538, 538);
        ctx.drawImage(avatar, canvas.width - 538 - 77, 200, 538, 538);
        let code = [`AzjSq6A`, `0KPHdMl`, `1NkGHdV`, `Ob79xYH`, `QOWQOab`];

        for (const link of code) {
            let image = await Canvas.loadImage(`https://i.imgur.com/${link}.png`).catch(() => { client.error(error) });
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }

        ctx.font = write(canvas, member1);
        ctx.fillStyle = '#000000';
        ctx.fillText(member1, 70 + (538 / 2), canvas.height - 35);
        ctx.font = write(canvas, member2);
        ctx.fillStyle = '#000000';
        ctx.fillText(member2, canvas.width - 538 - 70 + (538 / 2), canvas.height - 35);
        attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'deathbattle.png');
    } catch (error) {
        client.error(error);
        attachment = `\`Image not avaliable due to an error: ${error}\``;
    }
    await loading.delete();
    load = await message.channel.send(attachment)
    load.edit(client.src.embed(`Deathbattle Started!`))
    let life1 = 100, life2 = 100, attack = false, history = [], fullhistory = [`P1: 100 | P2: 100`];
    let embed = await load.edit(client.src.embed().setTitle(`${member1} VS ${member2}`))
    let key = [
        `/USER1/ burned /USER2/ with fire for /X/ dmg./5`,
        `/USER1/ froze /USER2/ a freeze ray for /X/ dmg./7`,
        `/USER1/ sliced /USER2/ with a knife for /X/ dmg./8`,
        `/USER1/ stabbed /USER2/ with a sword for /X/ dmg./15`,
        `/USER1/ shot /USER2/ with a gun for /X/ dmg./15`,
        `/USER1/ ran over /USER2/ with a truck for /X/ dmg./21`,
        `/USER1/ threw /USER2/ off a cliff for /X/ dmg./17`,
        `/USER1/ touched /USER2/ for /X/ dmg./2`,
        `/USER1/ used ${client.user.username} to spam /USER2/ for /X/ dmg./6`,
        `/USER1/ DDoSed /USER2/ for /X/ dmg./9`,
        `/USER1/ gave /USER2/ a death hug for /X/ dmg./9`,
        `/USER1/ drowned /USER2/ underwater for /X/ dmg./11`,
        `/USER1/ kicked /USER2/ for /X/ dmg./4`,
        `/USER1/ nuked /USER2/ for /X/ dmg./17`,
        `/USER1/ melted /USER2/ with lava for /X/ dmg./13`,
        `/USER1/ crushed /USER2/ with a RPG for /X/ dmg./12`,
        `/USER1/ gave /USER2/ a death hug for /X/ dmg./9`,
        `/USER1/ licked /USER2/ for /X/ dmg./2`
    ];
    start();

    function start() { setTimeout(async () => { await play() }, 2 * 1000); };

    async function play() {
        if (life1 === 0 || life2 === 0) { return winner(); }
        else {
            attack = attack ? false : true;
            if (attack) {
                let move = await getAttack(member1, member2);
                life2 -= move[0];
                if (life2 < 0) { life2 = 0; }
                addHistory(`${client.emojis.cache.get(client.emoji.attack).toString()} ${move[1]}`, `**»** ${move[1]}\nP1: ${life1} | P2: ${life2}`);
            } else {
                let move = await getAttack(member2, member1);
                life1 -= move[0];
                if (life1 < 0) { life1 = 0; }
                addHistory(`${client.emojis.cache.get(client.emoji.response).toString()} ${move[1]}`, `**«** ${move[1]}\nP1: ${life1} | P2: ${life2}`);
            }
            start();
        }
    }

    async function winner() {
        let winner = life1 === 0 ? member2 : member1;
        addHistory(`${client.emojis.cache.get(client.emoji.winner).toString()} __*${winner}*__ has won the battle!`, `${client.emojis.cache.get(client.emoji.winner).toString()} __*${winner}*__ has won the battle!`);
        let again = client.emojis.cache.get(client.emoji.again), log = client.emojis.cache.get(client.emoji.log);
        await embed.react(again);
        await embed.react(log);

        const filter = (reaction, user) => [again.name, log.name].includes(reaction.emoji.name) && (client.user.id !== user.id);
        const collector = embed.createReactionCollector(filter);

        collector.on('collect', async (reaction) => {
            if (reaction.emoji.name === again.name) {
                embed.reactions.removeAll();
                collector.stop();
                client.commands.get(module.exports.code.title).run(client, message, args);
            }
            else if (reaction.emoji.name === log.name) {
                embed.reactions.removeAll();
                fullhistory = fullhistory.join(`\n`);
                fullhistory = fullhistory.length >= 2048 ? `${fullhistory.substring(0, 2045)}...` : fullhistory;
                embed.edit(client.src.embed().setAuthor(`${member1}[P1]\n${member2}[P2]`).setTitle(`Full battle log`).setDescription(fullhistory));
                await embed.react(again);
            }
        });

        setTimeout(async () => { embed.reactions.removeAll(); collector.stop(); }, 20 * 1000);
    }

    async function addHistory(input, full) {
        fullhistory.push(full);
        let add = history.length < 3 ? true : false;
        if (add) { history.push(input); }
        else { history.shift(); history.push(input); };
        let update = client.src.embed().setDescription(`${client.arrow} ${member1} has: ${life1}/100 health\n${client.arrow} ${member2} has: ${life2}/100 health\n\n**History**\n${history.join(`\n`)}`);
        await embed.edit(update);
    }

    async function getAttack(user1, user2) {
        let rand = Math.floor(Math.random() * key.length);
        let move = key[rand];
        let last = move.lastIndexOf(`/`);
        let dmg = parseInt(move.substring(last + 1));
        let original = [`/USER1/`, `/USER2/`, `/X/`];
        let replace = [user1, user2, move.substring(last + 1)];
        for (let i = 0; i < original.length; i++) { while (move.includes(original[i])) { let loc = move.indexOf(original[i]); move = `${move.substring(0, loc)}__*${replace[i]}*__${move.substring(loc + original[i].length)}`; }; };
        move = move.substring(0, move.lastIndexOf(`/`));
        return [dmg, move]
    }
    client.src.log(message);
}

module.exports.code = {
    title: "deathbattle",
    about: "%B%'s information and number counts",
    usage: ["%P%source"],
    alias: ["db"],
}