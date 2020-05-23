module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let loading = await message.channel.send(client.send.loading()),
        code = args.join(" ");
    const embed = client.send.embed();
    if (!client.send.approve(message.author.id, `OWNER`)) {
        client.send.restrict(message, 16);
        return client.send.log(message, `hiro`);
    }

    if (!code) {
        loading.delete()
        client.send.input(message, `Input: \`${module.exports.code.usage[0]}\` -- Returns: \`${module.exports.code.description}\``);
        return client.send.log(message);
    }

    if (code.toLowerCase().includes(`api`) || code.toLowerCase().includes(`config`)) {
        embed
            .addField(`📥 Input`, `\`\`\`\n${code}\n\`\`\``)
            .addField(`📤 Output`, `\`\`\`xl\nERROR: You do not want to do this!\nA word has triggered the eval command to terminate!\n\`\`\``)
            .addField(`Status`, `${client.emojis.cache.get(client.util.emoji.red).toString()} - Failed`);
        await loading.edit(embed).catch(error => client.send.report(message, error));
        return client.send.log(message, `hiro`);
    }

    try {
        let evaled = clean(await eval(code)),
            output;
        if (evaled.constructor.name === `Promise`) {
            output = `📤 Output (Promise)`;
        } else {
            output = `📤 Output`;
        }
        if (evaled.length > 800) {
            evaled = evaled.substring(0, 800) + `...`;
        }
        embed
            .addField(`📥 Input`, `\`\`\`\n${code}\n\`\`\``)
            .addField(output, `\`\`\`xl\n${evaled}\n\`\`\``)
            .addField(`Status`, `${client.emojis.cache.get(client.util.emoji.green).toString()} - Success`);
        await loading.edit(embed).catch(error => send.report(message, error));
        return client.send.log(message, `hiro`);
    }
    catch (err) {
        console.log(err)
        embed
            .addField(`📥 Input`, `\`\`\`\n${code}\n\`\`\``)
            .addField(`📤 Output`, `\`\`\`xl\n${err.stack}\n\`\`\``)
            .addField(`Status`, `${client.emojis.cache.get(client.util.emoji.red).toString()} - Failed`);
        await loading.edit(embed).catch(error => client.send.report(message, error));
        return client.send.log(message, `hiro`);
    }



    function clean(text) {
        if (typeof text !== `string`)
            text = require(`util`).inspect(text, { depth: 0 })
        let rege = new RegExp(client.config.token, "gi");
        text = text
            .replace(/`/g, `\`` + String.fromCharCode(8203))
            .replace(/@/g, `@` + String.fromCharCode(8203))
            .replace(rege, `For security reasons I cannot show this.`)
        return text;
    }
}

module.exports.code = {
    name: "eval",
    description: "Evaluates [CODE]",
    group: "owner",
    usage: ["/PREFIX/eval [CODE]"],
    accessableby: "Owner",
    aliases: ["eval", "evaluate"]
}