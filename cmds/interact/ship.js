const { clean } = require("../../res/src")

module.exports.run = async (client, message, args, guild) => {
    let [text1, text2, percent, div] = [args[0], args.splice(1).join(` `)]
    if (!text1) return client.src.invalid(message, module.exports.title, guild)
    if (!text2) text2 = message.guild.members.cache.get(message.author.id).displayName
    text1 = await clean(text1)
    text2 = await clean(text2)
    console.log(text1, text2)
    if (text1.length > text2.length) {
        percent = text2.length
        div = text1.length
    } else {
        percent = text1.length
        div = text2.length
    }

    let ship = (((percent) * text1.length) / percent) + div
    if (ship % 2 === 0) ship = 50 + ship
    else if (ship % 3 === 0) ship = 50 - ship
    if (ship > 100) ship = 100 - (ship % 100)
    if (text1.length < text2.length) ship = 100 - ship
    let part1 = Math.floor(ship - Math.floor(Math.random() * ship) + 1)
    let [part2, fill, msg, shipmeter] = [Math.floor(ship - part1), Math.floor((ship + 5) / 10), Math.floor(ship / 10), ``]

    if (text1 === text2) {
        msg = 10
        part1 = 50
        part2 = 50
        ship = 100
        for (let i = 0; i < msg; i++) {
            shipmeter += client.emojis.cache.get(client.util.emoji.filled).toString()
        }
    }
    else {
        for (let i = 0; i < 10; i++) {
            if (i < fill) shipmeter += client.emojis.cache.get(client.util.emoji.filled).toString()
            else shipmeter += client.emojis.cache.get(client.util.emoji.empty).toString()
        }
    }

    let comment = [
        [`Not compatible?!`, `What a joke!`, `Did you even need me to tell you?`],
        [`This is unsettling...`, ``],
        `Maybe rethink this`,
        `This isn't good enough`,
        `Is this destiny?`,
        `Could be better!`,
        `So close peeps so close...`,
        `Well I support you the whole way`,
        `Good Match!!`,
        `These calcuations are past my ability! Perfect Match!`,
        [`Wimp, shipping yourself`]
    ]
    
    await message.channel.send(client.embed().setTitle(`Shipping ${text1} and ${text2}`).setDescription(`**${text1}** contributes \`${part1}%\`\n**${text2}** contributes \`${part2}%\``).addField(`Ship-meter`, `${shipmeter} ${ship}%\n${comment[msg][Math.floor(Math.random() * comment[msg].length)]}`))

    async function clean(input) {
        if (input.startsWith(`<@&`) && input.endsWith(`>`)) {
            let role = message.guild.roles.cache.get(input.slice(3, -1))
            if (role) return role.name
        }
        if (input.startsWith(`<@!`) && input.endsWith(`>`)) {
            let member = message.guild.members.cache.get(input.slice(3, -1))
            if (member) return member.displayName
        }
        if (input.startsWith(`<@`) && input.endsWith(`>`)) {
            let member = message.guild.members.cache.get(input.slice(2, -1))
            if (member) return member.displayName
        }
        return input
    }
}
module.exports.code = {
    title: "ship",
    about: "ships [TEXT1] (TEXT2)",
    usage: ["%P%ship [TEXT1] (TEXT2)"]
}