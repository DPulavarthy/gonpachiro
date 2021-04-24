module.exports.run = async (client, message, args, guild) => {
    if (!args[0]) return client.src.invalid(message, module.exports.code.title, guild)
    let load = client.src.loading({ loading: false })
    let loading = await message.channel.send(load.embed)
    for (let word of [`api`, `env`, `token`]) {
        if (args.join(` `).includes(word)) return result(`ERROR: You do not want to do this!\nA word has triggered the eval command to terminate!\nWord: \'${word}\'`)
    }
    try {
        let evaled = clean(await eval(args.join(` `)))
        if (evaled.length > (1900 - args.join(` `).length)) evaled = `${evaled.substring(0, (1900 - args.join(` `).length))}...`
        return result(evaled, true)
    } catch (error) {
        console.log(`${`[EVALER]: [-----] ${error}`.red}`)
        return result(error)
    }

    function result(output, status) {
        let embed = client.embed()
            .setDescription(`**Input**\n${client.src.code(args.join(` `))}\n**Output**\n${client.src.code(output, `js`)}`)
            .addField(`\u200b`, `**Status**: ${status ? `\`${String.fromCodePoint(128994)} SUCCESS\`` : `\`${String.fromCodePoint(128308)} FAILED\``}`)
        setTimeout(async () => loading.edit(embed), load.time)
    }

    function clean(text) {
        if (typeof text !== `string`) text = require(`util`).inspect(text, { depth: 0 })
        return text
            .replace(/`/g, `\`${String.fromCharCode(8203)}`)
            .replace(/@/g, `@${String.fromCharCode(8203)}`)
            .replace(new RegExp(process.env.TOKEN, `gi`), `[DENIED]`)
    }
}

module.exports.code = {
    title: "eval",
    about: "Evaluates [CODE]",
    usage: ["%P% eval [CODE]"]
}