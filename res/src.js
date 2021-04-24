let [{ MessageEmbed, Collection, version }, { Player }, client] = [require(`discord.js`), require(`discord-music-player`)]

module.exports = {
    async startup(input, time) {
        client = input
        Object.mergify(client, {
            src: this,
            embed: this.embedify,
            logger: this.logger,
            util: require(`../data/storage/util.js`),
            prefix: process.decode(process.env.DISCORD_BOT_CLIENT_PREFIX).data,
            chat: new Collection(),
            data: new Collection(),
            owners: [`CLIENT_OWNER_ID`, `CLIENT_CO_OWNER_ID`].map(id => process.decode(process.env[id]).data),
            userCount: client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b, 0),
            comment: (text) => { return client.embed().setDescription(client.codeify(text, `asciidoc`)) },
            codeify: (data, type) => { return `\`\`\`${type}\n${data}\n\`\`\`` },
            music: new Player(client, { timeout: 30 * 1000 })
        })
        this.pingify()
        // this.mockupify()
        require(`../data/storage/counter.js`)(client)
        client.commands.groups = [...new Set(client.commands.groups)]
        console.log(`[PROGRM]: ${this.timeify(time)} Connected Successfully to: ${client.user.tag}!`)
        // let user = await client.users.fetch(client.owners[0])
        // console.log(user.presence.status)
    },
    timeify(time) {
        time = time ? ((new Date().getTime() - time) / 1000).toFixed(2) : null
        return time ? time >= 10 ? `[>9.99s]` : `[${time}s]` : `[-----]`
    },
    embedify(input) {
        return new MessageEmbed()
            .setAuthor(input ? (input.title ? input.title : `${input.channel.type === `dm` ? `Sent` : `Requested`} by: ${message.author.tag}`) : ``, input && !input.title ? input.author.avatarURL({ format: "png", dynamic: true, size: 2048 }) : ``)
            .setFooter(`Provided by: ${client.user.tag}`, client.user.avatarURL({ format: `png`, dynamic: true, size: 2048 }))
            .setColor(client.util.main)
            .setTimestamp()
    },
    logger(data, time) {
        let msg = `[${new Date().toLocaleString({ hour12: true, timeZone: `America/Chicago` })} CDT | DJS: v${version} | NJS: ${process.version}]`
        if (data.error) return console.log(`[ERROR!]: ${client.src.timeify()} ${data.error.message} => ${msg}\n${data.error.stack}`)
        else return console.log(`[PROGRM]: ${client.src.timeify(time)} ${data.author.tag} sent: ${data.content} ${msg}`)
    },
    commandify(input) {
        return client.commands.get(input.toLowerCase()) || client.commands.get(client.commands.aliases.get(input.toLowerCase())) || null
    },
    equalify(...data) {
        for (let num of data) if (typeof num !== `number`) return
        let max = Math.max(...data).toString().length
        for (let i = 0; i < data.length; i++) {
            let stringify = data[i].toString()
            if (stringify.length < max) {
                switch (data[i] > 0) {
                    case true: {
                        for (let i = 0; i < max - stringify.length; i++) stringify = `0${stringify}`
                        break
                    }
                    case false: {
                        stringify = stringify.substring(1)
                        for (let i = 0; i < max - stringify.length - 1; i++) stringify = `0${stringify}`
                        stringify = `-${stringify}`
                        break
                    }
                }
            }
            data[i] = stringify
        }
        return data
    },
    pingify() {
        client.data.set(`ping`, [])
        setInterval(async () => {
            let channel = client.channels.cache.get(client.util.channel.pingify)
            if (channel) {
                let loading = await channel.send(`Loading...`)
                let processing = await channel.send(`Processing...`)
                let load = processing.createdTimestamp - loading.createdTimestamp
                loading.delete()
                processing.delete()
                let data = client.data.get(`ping`)
                if (data.length > 7) data.shift()
                data.push(load < 0 ? 0 : load)
                client.data.set(`ping`, data)
            }
        }, 6 * 1000)
    },
    _guildAdd(message, emit) {
        let preset = {
            id: message.guild.id,
            f: 0,
            cmds: 0,
            gifs: {},
            tips: true,
            nitro: false,
            errors: true,
            premium: false,
            autodect: false,
            prefix: client.prefix,
            translate: `en`,
            badges: [],
            chatlist: [],
            blacklist: []
        }
        client.db._guilds.insertOne(preset, () => emit ? client.emit(`message`, message) : null)
    },
    _guild(guild) {
        switch (guild.create) {
            case true: {
                console.log(`Joined Guild: ${guild.create.name}`)
                break
            }
            case false: {
                console.log(`Left Guild: ${guild.delete.name}`)
                break
            }
        }
    }
}
/*
let premium_guild = {
    id: message.guild.id, // Guild ID [String]
    f: 0, // F count [Int]
    cmds: 0, // Commands count [Int]
    gifs: {}, // Gifs count [Obj]
    tips: true, // Loading embed tips
    nitro: false, // Nitro mockup
    errors: true, // Show errors on bot
    premium: false, // False if no premium, string if user claimed
    autodect: false, // Autodetect links like osu
    prefix: client.prefix, // Custom prefix for entire server
    translate: `en`, // Chat autotranslate for entire server
    badges: [], // Server badges
    chatlist: [], // Channels for autochatlist........ add a spam detect to make sure resources aren't getting spammed [1, unl]
    blacklist: [] // Lock bot to specific channels [1, unl]
}

let premium_user = {
    id: user.id, // User ID [String]
    f: 0, // F count [Int]
    cmds: 0, // Commands count [Int]
    gifs: {}, // Gifs count [Obj]
    tips: true, // Loading embed tips
    nitro: false, // Nitro mockup
    errors: true, // Show errors on bot
    autodect: false, // Autodetect links like osu
    prefix: client.prefix, // User set prefix
    translate: `en`, // Chat autotranslate to
    badges: [] // User badges

}
*/