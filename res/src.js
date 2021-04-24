let [{ Collection, MessageEmbed }, client] = [require(`discord.js`)]

module.exports = {
    startup(input, time) {
        client = input
        client.src = this
        client.util = require(`./util.js`)
        client.prefix = process.env.PREFIX
        client.emoji = client.util.emoji
        client.comment = this.comment
        client.embed = this.embed
        client.error = this.error
        client.log = this.log
        client.time = this.time
        client.chat = new Collection()
        client.data = new Collection()
        client.broken = false
        this.ping()
        this.update()
        this.status()
        client.owners = [`476812566530883604`, `568824243396149248`, `189238841054461952`]
        console.log(`[PROGRM]: ${client.time(time)} ${client.user.tag} Connection Successful!`.progrm)
        // switch (process.argv[2] ? process.argv[2].toLowerCase() : null) {
        //     case `testing`: {
        //         client.broken = !client.broken
        //         console.log(`[PROGRM]: [-----] Client status set to \'under development\'`.progrm)
        //         break
        //     }
        //     case `exit`: {
        //         console.log(`[PROGRM]: [-----] Client connected to API, then exited`.progrm)
        //         process.exit(0)
        //     }
        //     default: {
        //         console.log(`[PROGRM]: [-----] Client started with no modifications.`.progrm)
        //         break
        //     }
        // }
    },
    log(message, time, guild) {
        let log = client.time(time)
        let system = `${`${message.author.tag}`.brightBlue} sent: [${message.content}]`
        // let channel = `\`${message.author.username}\` sent: \`${message.content}\` in channel \`${message.channel.name}\` of guild \`${message.guild.name}\``
        client.db._guilds.updateOne({ id: guild.id }, { $set: { cmds: ++guild.cmds } }, async (error) => {
            if (error) client.error(error)
        })
        // client.channels.cache.get(client.util.id.logs).send(`${log} ${channel}`)
        return console.log(`[INFORM]: ${log} ${system}`.logger)
    },
    code(message, type) { return `\`\`\`${type ? type : ``}\n${message}\n\`\`\`` },
    setup(input, data) { client.data.set(input, data ? data : new Collection()) },
    error(message) { return console.log(`[ERROR!]: [-----] ${message}`.errors) },
    clean(message, guild) { return message.replace(/%B%/g, client.user.username).replace(/%P%/g, guild.prefix) },
    time(time) { return ((new Date().getTime() - time) / 1000).toFixed(2) > 9.99 ? `[>9.9s]` : `[${((new Date().getTime() - time) / 1000).toFixed(2)}s]` },
    embed(message) {
        return new MessageEmbed()
            .setAuthor(message ? (message.title ? message.title : `${message.channel.type === `dm` ? `Sent` : `Requested`} by: ${message.author.tag}`) : ``, message && !message.title ? message.author.avatarURL({ format: "png", dynamic: true, size: 2048 }) : ``, client.util.link.support)
            .setFooter(`Provided by: ${client.user.tag}`, client.user.avatarURL({ format: "png", dynamic: true, size: 2048 }))
            .setColor(client.util.id.main)
            .setTimestamp()
    },
    loading(guild) {
        let tips = [
            `We are still alive`,
            `I have ${client.lines} lines of code`,
            `I am not based off Naruto, sorry kids`,
            `The ping graph is entirely made with code`,
            `My website's data is update every 30 minutes`,
            `The ping graph doesn't have a name, so I call him kevin`,
            `My status is on mobile because I am hosted on a phone, just kidding`,
            `Don't like loading tips? Use ${guild.prefix}tips to disable or enable them`,
            `The ${guild.prefix}ship command is not random, it has it's own system of logic`,
            {
                text: `Did u know I have a website? https://jonin.gq`,
                link: `https://jonin.gq`
            },
            {
                text: `Vote for me: https://top.gg/bot/662517805983334416/vote`,
                link: `https://top.gg/bot/662517805983334416/vote`
            },
            {
                text: `You can see the full command list at: https://jonin.gq/commands`,
                link: `https://jonin.gq/commands`,
            },
            {
                text: `Need help? Join the support server: https://support.jonin.gq`,
                link: `https://support.jonin.gq`,
            }
        ]
        let message = !guild.loading ? `Loading...` : tips[Math.floor(Math.random() * tips.length)]
        return { embed: client.comment(message.text ? message.text : message, message.link), time: (!guild.loading ? 1 : (message.text ? message.text.length : message.length) * 0.1) * 1000 }
    },
    comment(message, link) { return client.embed().setTitle(`**\`${message}\`**`).setURL(link).setColor(message.toUpperCase().startsWith(`ERROR`) ? client.util.id.failed : client.util.id.main) },
    invalid(message, title, guild, image) {
        let command = client.commands.get(title)
        const embed = client.embed()
            .setAuthor(`${message.guild.members.cache.get(message.author.id).displayName}`, message.author.displayAvatarURL(), client.util.link.support)
            .setDescription(`You have entered an invalid command, below is the proper way to use it\nInput: ${client.src.clean(command.code.usage[0], guild)}\nResult: ${client.src.clean(command.code.about, guild)}`)
            .setImage(image)
            .setColor(client.util.id.failed)
        message.channel.send(embed)
    },
    // create(collection, data, message, guild) {
    //     collection.insertOne(data, async (error) => {
    //         if (error) client.error(error)
    //         if (message) return require(`./msg.js`)(message, message.client, new Date().getTime(), guild)
    //     })
    // },
    _create(message) {
        let preset = {
            id: message.guild.id,
            f: 0,
            cmds: 0,
            nitro: false,
            errors: true,
            loading: true,
            premium: false,
            autodect: false,
            prefix: client.prefix,
            translate: `en`,
            badges: [],
            chatlist: [],
            blacklist: []
        }
        client.db._guilds.insertOne(preset, async (error) => {
            if (error) client.error(error)
            client.emit(`message`, message)
        })
    },
    ping() {
        client.data.set(`ping`, [])
        setInterval(async () => {
            let channel = client.channels.cache.get(client.util.channel.ping)
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
        }, 60 * 1000)
    },
    rank(message, id, loc, type) {
        let arr = message.guild.members.cache.array(), pos = 0;
        arr.sort((a, b) => a.joinedAt - b.joinedAt);
        if (loc && isNaN(parseInt(loc))) { return null; }
        else if (loc && !isNaN(parseInt(loc))) { let id = arr[loc - 1].id; return client.users.cache.get(id); }
        else {
            for (let i = 0; i < arr.length; i++) { if (arr[i].id == id) pos = i + 1; };
            if (type && type.toUpperCase() === `INT`) { return pos };
            if (pos % 10 === 1 && pos != 11) { pos = `${pos.toString()}st`; }
            else if (pos % 10 == 2 && pos != 12) { pos = `${pos.toString()}nd`; }
            else if (pos % 10 == 3 && pos != 13) { pos = `${pos.toString()}rd`; }
            else { pos = `${pos.toString()}th`; }
            return pos;
        }
    },
    async status() {
        await client.user.setActivity(`Just Started Up. What Did I Miss? | ${client.prefix}help`, { type: `LISTENING` })
        setInterval(async () => {
            let key = [
                // { type: `WATCHING`, data: `${client.users.cache.get(client.util.id.creator.id).tag} Develop Me` },
                // { type: `WATCHING`, data: `${client.users.cache.get(client.util.id.cocreator.id).tag} Break Me` },
                { type: `WATCHING`, data: `${client.channels.cache.size.toLocaleString()} Channels` },
                { type: `WATCHING`, data: `${client.users.cache.size.toLocaleString()} Villagers` },
                { type: `WATCHING`, data: `${client.guilds.cache.size.toLocaleString()} Guilds` },
                { type: `WATCHING`, data: `The Yae Village Shrine Maidens` },
                { type: `WATCHING`, data: `The Yae Village Gate Keepers` },
                { type: `WATCHING`, data: `The Yae Village Alders` },
                // { type: `PLAYING`, data: `With ${client.lines.toLocaleString()} Lines Of Code` },
                { type: `PLAYING`, data: `I am Darkbolt Jonin` },
                { type: `PLAYING`, data: `Not from Naruto\u2122` },
                { type: `PLAYING`, data: `I am Yae Sakura` },
                { type: `PLAYING`, data: `Approved by De~Yuo!` },
                { type: `PLAYING`, data: `jonin.gq` }
            ]
            let rand = Math.floor(Math.random() * key.length)
            await client.user.setActivity(`${key[rand].data} | ${client.prefix}help`, { type: key[rand].type })
        }, 60 * 1000)
    },
    // status(simple) {
    //     let final = [];
    //     if (!client.db) { final.push(`Database Offline`); }
    //     else if (client.db) { client.database.config.findOne({ case: `status` }, async function (error, result) { if (error) { client.error(error); }; if (!result.data) { final.push(`Currently Disabled`); }; }) };
    //     if (simple) { return final.length > 0 ? `${client.emojis.cache.get(client.emoji.red)} **[${client.user.tag}:](${client.util.link.support})** ${final.join(`, `)}` : `${client.emojis.cache.get(client.emoji.green)} **[${client.user.tag}:](${client.util.link.support})** All Systems Operational` };
    //     if (final.length > 0) { return `${client.emojis.cache.get(client.emoji.warning).toString()} ${final.join(`, `)}.`; }
    //     else { return `${client.emojis.cache.get(client.emoji.check).toString()} All Systems Operational, Running master prefix \`${client.prefix}\`` };
    // },
    async getUser(members, input) { return input ? await members.find(member => member.user.tag.toLowerCase().includes(input.toLowerCase())) || false : false },
    async getRole(roles, input) { return input ? await roles.find(role => role.name.toLowerCase().includes(input.toLowerCase())) || false : false },
    async userlist(message, args) {
        let user = []
        if (!args.join(` `)) return [client.users.cache.get(message.author.id)]
        for (let arg of args) {
            if (client.users.cache.get(arg)) user.push(client.users.cache.get(arg))
            else if (arg.toUpperCase() === `OWNER`) user.push(client.users.cache.get(message.guild.owner.user.id))
            else if (arg.toUpperCase() === `FIRST`) user.push(client.src.rank(message, null, 1))
            else if (arg.toUpperCase() === `LATEST`) user.push(client.src.rank(message, null, message.guild.members.cache.size))
            else if (arg.startsWith(`<@!`) && arg.endsWith(`>`)) user.push(client.users.cache.get(arg.substring(3, arg.length - 1)))
            else if (arg.startsWith(`<@`) && arg.endsWith(`>`)) user.push(client.users.cache.get(arg.substring(2, arg.length - 1)))
            else await client.src.getUser(message.guild.members.cache, arg).then(res => { if (res) user.push(client.users.cache.get(res.id)) })
        };
        return user
    },
    update() {

    },
}