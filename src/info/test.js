module.exports.run = async (client, message, args) => {
    message.channel.send(client.embed().setDescription(`[${client.codeify(`testing`)}](https://www.google.com/ "Click here bish")`))

    // let attachment = new MessageAttachment(`./data/assets/logo.png`, `logo.png`)
    // let before = await message.channel.send(client.embed().setTitle(`Before Edit`).attachFiles(attachment).setImage(`attachment://logo.png`))
    // setTimeout(() => before.edit(client.embed().setTitle(`After Edit`).attachFiles(attachment).setImage(`attachment://logo.png`)), 2000)


    // let [time, loading, word] = [new Date().getTime(), await message.channel.send(client.embed().setTitle(`Loading...`))]
    // switch (args.command.toLowerCase()) {
    //     case `ping`: {
    //         word = `\uD83C\uDFD3 Pong!`
    //         break
    //     }
    //     case `beep`: {
    //         word = `\uD83D\uDC09 Boop!`
    //         break
    //     }
    //     case `ding`: {
    //         word = `\uD83D\uDECE\uFE0F Dong!`
    //         break
    //     }
    // }
    // let [data, load] = [client.data.get(module.exports.data.title), loading.createdTimestamp - message.createdTimestamp]
    // data.push(load)
    // await chart(data)
    // data.pop()
    // let [db, field, attachment] = [new Date().getTime(), new Array(), new MessageAttachment(`./data/assets/ping.png`, `ping.png`)]
    // await client.db._guilds.findOne({ id: message.guild.id })
    // let equalify = client.src.equalify(client.ws.ping, load, new Date().getTime() - time, new Date().getTime() - db)
    // field.push(`\u279c      API Latency is :: ${equalify[0]} ms`)
    // field.push(`\u279c  Message Latency is :: ${equalify[1]} ms`)
    // field.push(`\u279c  Command Latency is :: ${equalify[2]} ms`)
    // field.push(`\u279c Database Latency is :: ${equalify[3]} ms`)
    // loading.delete()
    // message.channel.send(client.embed().setDescription(`${client.codeify(`${word}, Hello There${message._guild.premium || message._author ? ` Premium User`: ``}!`)}${client.codeify(field.join(`\n`), `asciidoc`)}`).attachFiles(attachment).setImage(`attachment://ping.png`)).then(() => unlinkSync(`./data/assets/ping.png`))

}

module.exports.data = {
    title: `test`,
    about: `Latency + API Latency + Server Latency`,
}

// let attachment = new MessageAttachment(`./ data / assets / logo.png`, `logo.png`)
// let before = await message.channel.send(client.embed().setTitle(`Before Edit`).attachFiles(attachment).setImage(`attachment://logo.png`))
// setTimeout(() => before.edit(client.embed().setTitle(`After Edit`).attachFiles(attachment).setImage(`attachment://logo.png`)), 2000)

// const {commands: {basic}, perms, arg} = require("../../../util/extensions/System/Command"),
//       {CommandoMessage} = require("elaracmdo"),
//       Canvas = require("canvas"),
//       Discord = require("discord.js"),
//       onGoing = new Set();


// module.exports = class BasicCommand extends basic {
//     constructor(client) {
//         super(client, {
//             name: "battle",
//             aliases: [`deathbattle`, `death`],
//             description: "Battle someone!",
//             group: "fun",
//             permissions: { bot: perms.basic },
//             only: { guild: true },
//             args: [
//                 arg(`member`, `member`, `What member do you want to battle?`)
//             ]
//         });
//     };
//     /**
//     * @typedef {Object} ArgsOptions
//     * @property {Discord.GuildMember} member
//     */
//     /**
//      * @param {CommandoMessage} message 
//      * @param {ArgsOptions} args
//      */
//     async run(message, {member}){
//         let [go, key, emojis] = [message.channel.id, [
//             `/USER1/ burned /USER2/ with fire for /X/ dmg./5`,
//             `/USER1/ froze /USER2/ a freeze ray for /X/ dmg./7`,
//             `/USER1/ sliced /USER2/ with a knife for /X/ dmg./8`,
//             `/USER1/ stabbed /USER2/ with a sword for /X/ dmg./15`,
//             `/USER1/ shot /USER2/ with a gun for /X/ dmg./15`,
//             `/USER1/ ran over /USER2/ with a truck for /X/ dmg./21`,
//             `/USER1/ threw /USER2/ off a cliff for /X/ dmg./17`,
//             `/USER1/ touched /USER2/ for /X/ dmg./2`,
//             `/USER1/ used ${this.client.user.username} to spam /USER2/ for /X/ dmg./6`,
//             `/USER1/ DDoSed /USER2/ for /X/ dmg./9`,
//             `/USER1/ gave /USER2/ a death hug for /X/ dmg./9`,
//             `/USER1/ drowned /USER2/ underwater for /X/ dmg./11`,
//             `/USER1/ kicked /USER2/ for /X/ dmg./4`,
//             `/USER1/ nuked /USER2/ for /X/ dmg./17`,
//             `/USER1/ melted /USER2/ with lava for /X/ dmg./13`,
//             `/USER1/ crushed /USER2/ with a RPG for /X/ dmg./12`,
//             `/USER1/ gave /USER2/ a death hug for /X/ dmg./9`,
//             `/USER1/ licked /USER2/ for /X/ dmg./2`
//         ], {
//             attack: { id: "792291458081095691" },
//             response: { id: "792291654844416010" },
//             winner: { id: "792291176375517184" },
//             log: { id: "792290922749624320" },
//             again: { id: "792290629497126933" },
//             player: { id: "792498059312365599" }
//         }];
//         for (const emoji of Object.keys(emojis)){
//             emojis[emoji].emoji = `<:${emoji}:${emojis[emoji].id}>`;
//         }
//         if(onGoing.has(go)) return message.error(`There's currently a battle going on in this channel, please wait for that to end.`);
//         if(!onGoing.has(go)) onGoing.add(go)
//         const client = this.client;
//         let attachment, 
//             loading = await message.boop({embed: {
//                 author: this.authorField(message, true),
//                 title: `${this.emojis.eload} Preparing the weapons for the fight!`,
//                 color: this.getColor(message),
//                 timestamp: new Date()
//             }})
//         if(!loading){
//             onGoing.delete(go)
//             return message.error(`I was unable to send the loading message...`);
//         }
//         let [member1, member2, user1, user2, life1, life2, attack, history, fullhistory] = [
//             message.member.displayName, 
//             member.displayName, 
//             message.member.user, 
//             member.user,
//             100, 100, false, [], [`P1: 100 | P2: 100`]
//         ];
//         const write = (canvas, text) => {
//             let ctx = canvas.getContext('2d'), fontSize = 70;
//             do {
//                 ctx.font = `${fontSize -= 10}px sans-serif`;
//                 ctx.textAlign = 'center'
//             } while (ctx.measureText(text).width > 210);
//             return ctx.font;
//         };
//         try {
//             let canvas = Canvas.createCanvas(1386, 768)
//             let [author, avatar, image] = await Promise.all([
//                 Canvas.loadImage(user1.displayAvatarURL({ format: "png", dynamic: true, size: 2048 })).catch(() => null),
//                 Canvas.loadImage(user2.displayAvatarURL({ format: "png", dynamic: true, size: 2048 })).catch(() => null),
//                 Canvas.loadImage(`https://raw.githubusercontent.com/Elara-Discord-Bots/Bot-Images/master/random/deathbattle.png`).catch(() => null)
//             ])
//             let ctx =  canvas.getContext("2d");
//             ctx.drawImage(author, 78, 200, 538, 538);
//             ctx.drawImage(avatar, canvas.width - 538 - 77, 200, 538, 538);
//             if(image) ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
//             ctx.font = write(canvas, member1);
//             ctx.fillStyle = '#000000';
//             ctx.fillText(member1, 70 + (538 / 2), canvas.height - 35);
//             ctx.font = write(canvas, member2);
//             ctx.fillStyle = '#000000';
//             ctx.fillText(member2, canvas.width - 538 - 70 + (538 / 2), canvas.height - 35);
//             attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'deathbattle.png');
//         }catch (error) {
//             attachment = `\`Image not avaliable due to an error: ${error}\``;
//         }
//         loading.delete();
//         let load = await message.channel.send(attachment).catch(() => null);
//         if(!load){
//             onGoing.delete(go);
//             return message.error(`I was unable to send the attachment, try again later!`)
//         }
//         let embed = await load.edit({embed: {
//             author: {
//                 name: `Deathbattle Started!`,
//                 icon_url: `${this.client.options.http.cdn}/emojis/${emojis.again.id}.png`,
//             },
//             title: `\`${member1}\` VS \`${member2}\``,
//             color: this.color.yellow
//         }})
//         start();
//         function start() { 
//             setTimeout(() => play(), 2000) 
//         };

//         function play() {
//             if (life1 === 0 || life2 === 0) return winner();
//             else {
//                 attack = attack ? false : true;
//                 if (attack) {
//                     let move = getAttack(member1, member2);
//                     life2 -= move[0];
//                     if (life2 < 0) life2 = 0;
//                     addHistory(`${emojis.attack.emoji} ${move[1]}`, `**»** ${move[1]}\nP1: ${life1} | P2: ${life2}`);
//                 } else {
//                     let move = getAttack(member2, member1);
//                     life1 -= move[0];
//                     if (life1 < 0) { life1 = 0; }
//                     addHistory(`${emojis.response.emoji} ${move[1]}`, `**«** ${move[1]}\nP1: ${life1} | P2: ${life2}`);
//                 }
//                 start();
//             }
//         }

//         function winner() {
//             let winner = life1 === 0 ? member2 : member1;
//             addHistory(`${emojis.winner.emoji} __*${winner}*__ has won the battle!`, `${emojis.winner.emoji} __*${winner}*__ has won the battle!`);
//             for (const emoji of [emojis.again.id, emojis.log.id]){
//                 if(!embed.deleted) embed.react(emoji).catch(() => {});
//             }
//             onGoing.delete(go);
//             const collector = embed.createReactionCollector((reaction, user) => [emojis.again.id, emojis.log.id].includes(reaction.emoji.id || "") && (client.user.id !== user.id));

//             collector.on('collect', async (reaction) => {
//                 if(!reaction.emoji.id) return null; // If there is no .id return nothing.
//                 if (reaction.emoji.id === emojis.again.id) {
//                     if(!embed.deleted) embed.delete().catch(() => {});
//                     collector.stop();
//                     client.registry.commands.get("battle").run(message, {member});
//                 }else 
//                 if (reaction.emoji.id === emojis.log.id) {
//                     if(!embed.deleted) embed.reactions.removeAll();
//                     fullhistory = fullhistory.join(`\n`);
//                     fullhistory = fullhistory.length >= 2048 ? `${fullhistory.substring(0, 2045)}...` : fullhistory;
//                     if(!embed.deleted) embed.edit({
//                         embed: {
//                             author: {
//                                 name: `${member1}[P1]\n${member2}[P2]`,
//                             },
//                             color: client.util.colors.yellow,
//                             title: `Full battle log`,
//                             description: fullhistory
//                         }
//                     })
//                     if(!embed.deleted) embed.react(emojis.again.id).catch(() => {})
//                 }
//             });

//             setTimeout(() => { 
//                 if(!embed.deleted) embed.reactions.removeAll(); 
//                 collector.stop(); 
//             }, 20000);
//         }

//         const addHistory = (input, full) => {
//             fullhistory.push(full);
//             let add = history.length < 3 ? true : false;
//             if (add) { history.push(input); }
//             else { history.shift(); history.push(input); };
//             if(!embed.deleted) embed.edit({
//                 embed: {
//                     description: `${emojis.player.emoji} \`${member1}\` has: ${life1}/100 health\n${emojis.player.emoji} \`${member2}\` has: ${life2}/100 health\n\n**History**\n${history.join(`\n`)}`,
//                     color: 0xff00aa,
//                     author: {
//                         name: `Deathbattle`,
//                         icon_url: `${this.client.options.http.cdn}/emojis/${emojis.again.id}.png`,
//                     },
//                     footer: {
//                         text: `Provided by: jonin.gq`,
//                         icon_url: `https://cdn.discordapp.com/emojis/711233474937487381.png?v=1`
//                     }
//                 }
//             });
//         },
//               getAttack = (user1, user2) => {
//             let rand = Math.floor(Math.random() * key.length);
//             let move = key[rand];
//             let last = move.lastIndexOf(`/`);
//             let dmg = parseInt(move.substring(last + 1));
//             let original = [`/USER1/`, `/USER2/`, `/X/`];
//             let replace = [user1, user2, move.substring(last + 1)];
//             for (let i = 0; i < original.length; i++) { while (move.includes(original[i])) { let loc = move.indexOf(original[i]); move = `${move.substring(0, loc)}__*${replace[i]}*__${move.substring(loc + original[i].length)}`; }; };
//             move = move.substring(0, move.lastIndexOf(`/`));
//             return [dmg, move]
//         }
//     };
// };