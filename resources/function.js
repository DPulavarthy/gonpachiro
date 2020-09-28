let client;
let { writeFileSync } = require(`fs`);

module.exports = {
    async chart(title, data, unit) {
        let { writeFileSync } = require(`fs`);
        let { registerFont } = require(`canvas`)
        registerFont(`./OpenSans-Regular.ttf`, { family: 'Open Sans' })
        let main = `#191919`, opposite = `#C0C0C0`, font = 70, old = [], follow = true, i = 1, j = 8, canvas = require(`canvas`).createCanvas(1000, 500), ctx = canvas.getContext('2d'), max = Math.max(...data);
        ctx.fillStyle = opposite;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        type(title.toUpperCase(), (canvas.width / 2), font, font);
        type(`0`, font - 15, canvas.height - font + 15);
        ctx.lineWidth = 5;
        ctx.strokeStyle = main;
        ctx.beginPath();
        ctx.moveTo(font, (font * 2) - 10);
        ctx.lineTo(font, canvas.height - font);
        ctx.lineTo(canvas.width - font, canvas.height - font);
        ctx.stroke();
        type(`X ${unit[1]} ago`, canvas.width / 2, canvas.height - font + 60);
        let x = font / 2, metrics = ctx.measureText(`X ms`), y = metrics.width / 2;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = `center`;
        ctx.fillText(`X ${unit[0]}`, -270, (canvas.height / 2) + font - 335);
        ctx.fillText(max, -125, (canvas.height / 2) + font - 300);
        ctx.fillText(max / 2, -265, (canvas.height / 2) + font - 300);
        ctx.restore();
        while (follow) { if (i % 2 !== 0) { draw(font - 10, (font * 2) + (i * 10), canvas.width - font - 10, (font * 2) + (i * 10)); }; i++; if ((font * 2) + (i * 10) >= canvas.height - font) { follow = false; }; };
        reset();
        while (follow) {
            if (i % 2 === 0) { draw(font + (i * 10), (font * 2), font + (i * 10), canvas.height - font + 10); };
            if ((i - 1) % 10 === 0) {
                if (j === 0) { type(`NOW`, font + (i * 10) + 13, canvas.height - font + 30); }
                else { type(j, font + (i * 10) + 10, canvas.height - font + 30); }
                j--;
            };
            i++;
            if ((font * 2) + (i * 10) >= canvas.width) { follow = false; };
        }
        reset();
        while (follow) { if ((i - 1) % 10 === 0) { callLine(data.length - j - 1, i); j--; }; i++; if ((font * 2) + (i * 10) >= canvas.width) { follow = false; }; };
        reset();
        while (follow) { if ((i - 1) % 10 === 0) { callPoint(data.length - j - 1, i); j--; }; i++; if ((font * 2) + (i * 10) >= canvas.width) { follow = false; }; };

        function callPoint(index, loc) {
            let cmin = (font * 2) + 10, cmax = canvas.height - font;
            crange = cmax - cmin;
            per = (data[index] * 100) / max;
            if (isNaN(per)) return;
            let x = font + (loc * 10) + (5 / 2), y = canvas.height - font - (15 / 2) - ((per / 100) * crange);
            circle(x, y, 15);
            type(data[index], x + 5, cmin - 21.5);
        }

        function callLine(index, loc) {
            let cmin = (font * 2) + 10, cmax = canvas.height - font;
            crange = cmax - cmin;
            per = (data[index] * 100) / max;
            if (isNaN(per)) return;
            let x = font + (loc * 10) + (5 / 2), y = canvas.height - font - (15 / 2) - ((per / 100) * crange);
            connect(old.length < 1 ? null : old, x + (15 / 2), y + (15 / 2));
            old = [x + (15 / 2), y + (15 / 2)];
        }

        function connect(old, newx, newy) {
            if (!old) return;
            ctx.lineWidth = 6;
            ctx.strokeStyle = main;
            ctx.beginPath();
            ctx.moveTo(old[0], old[1]);
            ctx.lineTo(newx, newy);
            ctx.stroke();
            ctx.lineWidth = 2;
            ctx.strokeStyle = client.util.id.main;
            ctx.beginPath();
            ctx.moveTo(old[0], old[1]);
            ctx.lineTo(newx, newy);
            ctx.stroke();
        }

        function reset() { follow = true, i = 1, j = 8; };
        function type(text, width, height, format) { ctx.font = write(text, format); ctx.fillStyle = main; ctx.fillText(text, width, height); };
        function circle(x, y, size) { ctx.beginPath(); ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI, false); ctx.fillStyle = client.util.id.main; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = main; ctx.stroke(); };
        function draw(startx, starty, movex, movey) { ctx.lineWidth = 2; ctx.strokeStyle = main; ctx.beginPath(); ctx.moveTo(startx, starty); ctx.lineTo(movex, movey); ctx.stroke(); };
        function write(text, type) { do { ctx.font = `${type === font ? font - 10 : font / 3}px "Open Sans"`; ctx.textAlign = `center` } while (ctx.measureText(text).width > 180); return ctx.font; };
        writeFileSync('./data/ping.png', canvas.toBuffer());

    },
    reset() {
        if (client.db) {
            client.database.guilds.find().toArray(async function (error, result) {
                if (error) { client.error(error); };
                if (result.length > 0) {
                    result.forEach(async guild => {
                        guild.data.forEach(valk => {
                            valk.points = false;
                            valk.battle = false;
                        })
                        let res = { $set: { data: guild.data } };
                        client.database.guilds.updateOne({ id: guild.id }, res, function (error) { if (error) { client.error(error); }; });
                    })
                }
            })
        }
    },
    gacha() {
        if (client.db) {
            client.database.guilds.find().toArray(async function (error, result) {
                if (error) { client.error(error); };
                if (result.length > 0) {
                    result.forEach(async guild => {
                        let res = { $set: { cooldown: false } };
                        client.database.guilds.updateOne({ id: guild.id }, res, function (error) { if (error) { client.error(error); }; });
                    })
                }
            })
        }
    },
    async ping() {
        setInterval(async () => {
            if (client.db) {
                client.database.data.findOne({ case: `ping` }, async function (error, result) {
                    if (error) { client.src.error(error); };
                    if (!result) { return client.src.db(null, `ping`, true, false); }
                    let msg1 = await client.channels.cache.get(client.util.id.ping).send(`Loading...`), msg2 = await client.channels.cache.get(client.util.id.ping).send(`Processing...`), load = msg2.createdTimestamp - msg1.createdTimestamp;
                    msg1.delete();
                    msg2.delete();
                    result.data.push(load.toFixed(0));
                    if (result.data.length > 8) { result.data.shift(); };
                    let res = { $set: { data: result.data } };
                    client.database.data.updateOne({ case: `ping` }, res, function (error) { if (error) { client.src.error(error); }; });
                });
            }
        }, 60 * 1000);
    },
    async status() {
        await client.user.setActivity(`Just Started Up. What Did I Miss? | ${client.prefix}help`, { type: `LISTENING` });
        setInterval(async () => {
            let key = [
                { type: `WATCHING`, data: `${client.users.cache.get(client.util.id.creator.id).tag} Develop Me`, },
                { type: `WATCHING`, data: `${client.users.cache.get(client.util.id.cocreator.id).tag} Break Me`, },
                { type: `WATCHING`, data: `${client.channels.cache.size.toLocaleString()} Channels`, },
                { type: `WATCHING`, data: `${client.users.cache.size.toLocaleString()} Villagers`, },
                { type: `WATCHING`, data: `${client.guilds.cache.size.toLocaleString()} Guilds`, },
                { type: `WATCHING`, data: `The Yae Village Shrine Maidens`, },
                { type: `WATCHING`, data: `The Yae Village Gate Keepers`, },
                { type: `WATCHING`, data: `The Yae Village Alders`, },
                { type: `PLAYING`, data: `With ${client.lines.toLocaleString()} Lines Of Code`, },
                { type: `PLAYING`, data: `I am Darkbolt Jonin`, },
                { type: `PLAYING`, data: `Not from Narutoï¿½`, },
                { type: `PLAYING`, data: `I am Yae Sakura`, },
                { type: `PLAYING`, data: `Approved by De~Yuo!`, },
                { type: `PLAYING`, data: `jonin.gq`, },
            ];
            let rand = Math.floor(Math.random() * key.length);
            await client.user.setActivity(`${key[rand].data} | ${client.prefix}help`, { type: key[rand].type });
        }, 60 * 1000);
    },
    async update(reren) {
        if (reren) { setInterval(async () => { update(); }, (3600000/2)); } else { update(); };

        async function update() {
            const { GoogleSpreadsheet } = require('google-spreadsheet');
            const doc = new GoogleSpreadsheet(`1Qt9_MFzGkOIkhbm82kPrTKH7xh5zSCecYTVrsJ3EKt4`);
            await doc.useServiceAccountAuth(client.key.sheets);
            await doc.loadInfo()
            const sheet = doc.sheetsByIndex[1];
            await sheet.loadCells(`A1:A1000`);
            for (let i = 1; i <= 1000; i++) {
                let clear = sheet.getCellByA1(`A${i}`);
                clear.value = ``;
            }
            await sheet.saveUpdatedCells();
            await sheet.loadCells(`A1:A${client.commands.size + client.groups.length + 1}`);
            let field = [];
            if (client.db) { client.database.config.findOne({ case: `toggle` }, async function (error, result) { if (error) { client.error(error); }; if (!result) { commands(); } else { commands(result.cmds); }; }); } else { commands(); };
            async function commands(disabled) {
                client.groups.forEach(group => {
                    let hold = { case: group, data: [] };
                    client.commands.forEach(command => { if (disabled) { disabled = disabled.includes(command.code.title) ? `Yes` : `No`; } else { disabled = `N/A` }; if (command.group === group) { hold.data.push(`${command.code.title}%%${client.src.clean(command.code.about)}%%${command.code.alias ? `&lt;${command.code.alias.join(`&gt; &lt;`)}&gt;` : `N/A`}%%${command.code.nsfw ? `Yes` : `No`}%%${command.code.beta ? `Yes` : `No`}%%${command.code.dm ? `Yes` : `No`}%%${command.code.ranks || `0`}%%${command.code.cooldown || `3`}sec`); }; });
                    field.push(hold);
                })
                let i = 1;
                for (let group of field) {
                    let temp = sheet.getCellByA1(`A${i}`);
                    temp.value = group.case;
                    i++;
                    for (let command of group.data) { let cmd = sheet.getCellByA1(`A${i}`); cmd.value = command; i++; };
                }
                await sheet.saveUpdatedCells();
            }
            const DBL = require(`dblapi.js`);
            const dbl = new DBL(client.key.dbl, client);
            dbl.postStats(client.guilds.cache.size);
            dbl.getBot(client.util.id.client).then(async data => {
                client.database.config.findOne({ case: `count` }, async function (error, result) {
                    if (error) { client.error(error); };
                    if (!result) { return client.src.db(message, `count`, 0, null, client.database.config); };
                    let label = `<span class="label"><img src="https://i.imgur.com/xMy1qwE.jpeg" title="HypeSquad Brilliance" alt="HypeSquad Brilliance" style="max-width:20px!important;padding-right:10px;" /><img src="https://i.imgur.com/09zbpYY.jpeg" title="Early Verified Bot Developer" alt="Early Verified Bot Developer" style="max-width:20px!important;" /><img src="https://i.imgur.com/PKiV6Rw.jpeg" title="Subscriber since Aug 9, 2020" alt="Nitro" style="max-width:20px!important;padding-left:10px;" /></span>`
                    let status
                    switch (client.users.cache.get(client.util.id.creator.id).presence.status.toUpperCase()) { case `ONLINE`: status = `#43b581`; break; case `IDLE`: status = `#faa61a`; break; case `DND`: status = `#f04747`; break; case `STREAMING`: status = `#643da7`; break; default: status = `#636b75`; };
                    await doc.loadInfo()
                    const sheet = doc.sheetsByIndex[0];
                    await sheet.loadCells(`A1:A22`);
                    let prefix = sheet.getCellByA1(`A1`);
                    prefix.value = `prefix:${client.prefix}`;
                    let length = sheet.getCellByA1(`A2`);
                    length.value = `length:${client.length.toLocaleString()}`;
                    let username = sheet.getCellByA1(`A3`);
                    username.value = `username:${client.user.tag}`;
                    let id = sheet.getCellByA1(`A4`);
                    id.value = `id:${client.user.id}`;
                    let main = sheet.getCellByA1(`A5`);
                    main.value = `index:${require(`../package.json`).main}`;
                    let command = sheet.getCellByA1(`A6`);
                    command.value = `command:${client.commands.size.toLocaleString()}`;
                    let lines = sheet.getCellByA1(`A7`);
                    lines.value = `lines:${client.lines.toLocaleString()}`;
                    let usage = sheet.getCellByA1(`A8`);
                    usage.value = `usage:${result.data.toLocaleString()}`;
                    let owner = sheet.getCellByA1(`A9`);
                    owner.value = `owner:${client.users.cache.get(client.util.id.creator.id).tag}`;
                    let cocreator = sheet.getCellByA1(`A10`);
                    cocreator.value = `cocreator:${client.users.cache.get(client.util.id.cocreator.id).tag}`;
                    let library = sheet.getCellByA1(`A11`);
                    library.value = `library:Discord.JS v${require(`discord.js`).version}`;
                    let version = sheet.getCellByA1(`A12`);
                    version.value = `version:Node.JS ${process.version}`;
                    let current = sheet.getCellByA1(`A13`);
                    current.value = `current:v${require(`../package.json`).version}`;
                    let channel = sheet.getCellByA1(`A14`);
                    channel.value = `channel:${client.channels.cache.size.toLocaleString()}`;
                    let user = sheet.getCellByA1(`A15`);
                    user.value = `user:${client.users.cache.size.toLocaleString()}`;
                    let created = sheet.getCellByA1(`A16`);
                    created.value = `created:${client.user.createdAt.toDateString()}`;
                    let month = sheet.getCellByA1(`A17`);
                    month.value = `month:${data.monthlyPoints.toLocaleString()}`;
                    let total = sheet.getCellByA1(`A18`);
                    total.value = `total:${data.points.toLocaleString()}`;
                    let server = sheet.getCellByA1(`A19`);
                    server.value = `server:${data.server_count.toLocaleString()}`;
                    let shard = sheet.getCellByA1(`A20`);
                    shard.value = `shard:${data.shards.length + 1}`;
                    let avatar = sheet.getCellByA1(`A21`);
                    avatar.value = `avatar:<img src="${client.users.cache.get(client.util.id.creator.id).avatarURL({ format: "jpeg", dynamic: true, size: 2048 })}" alt="${client.users.cache.get(client.util.id.creator.id).username}'s PFP" style="box-shadow:0 1px 1rem ${status};"/>`
                    let creator = sheet.getCellByA1(`A22`);
                    creator.value = `creator:<a class="tooltip" href="https://discord.com/users/${client.util.id.creator.id}">${client.users.cache.get(client.util.id.creator.id).tag}${label}</a>`
                    await sheet.saveUpdatedCells();
                })
            })
        }
    },
    async database(database) {
        database.connect(async error => {
            if (error) { console.log(error); client.error(error); client.db = false; return database.close(); };
            client.database = database.db(`jonin`);
            client.database.listCollections().toArray(async function (error, collections) {
                if (collections.length < 1) { client.error(`Required Database not found!`); client.db = false; return database.close(); }
                if (error) { client.error(error); };
                let exists = [], required = [`data`, `valks`, `heads`, `guilds`, `config`, `commands`];
                collections.forEach(collection => exists.push(collection.name));
                for (let collection of required) { if (!exists.includes(collection)) { await client.database.createCollection(collection, function (error) { if (error) { client.error(error); }; }); }; };
            });
            client.db = true;
            client.database.data = client.database.collection(`data`);
            client.database.valks = client.database.collection(`valks`);
            client.database.heads = client.database.collection(`heads`);
            client.database.guilds = client.database.collection(`guilds`);
            client.database.config = client.database.collection(`config`);
            client.database.commands = client.database.collection(`commands`);
            console.log(`[PROGRM]: Database Connection Successful!`.yellow);
            client.function.rank();
        });
    },
    async guildCreate(guild) {
        let field = [];
        field.push(`${client.arrow} Guild Name: ${guild.name}`);
        field.push(`${client.arrow} Guild ID: ${guild.id}`);
        field.push(`${client.arrow} Members: ${guild.memberCount - 1}`);
        field.push(`${client.arrow} Humans: ${guild.members.cache.filter(member => !member.user.bot).size}`);
        field.push(`${client.arrow} Bots: ${guild.members.cache.filter(member => member.user.bot).size - 1}`);
        field.push(`${client.arrow} Owner Name: ${guild.owner.user.tag}`);
        field.push(`${client.arrow} Owner ID: ${guild.owner.user.id}`);
        const embed = client.embed().setAuthor(`New Guild Acclaimed!`).setDescription(field.join(`\n`));
        client.channels.cache.get(client.util.id.guilds).send(embed);
    },
    async memberRemove(user) {
        user = client.users.cache.get(user.id);
        if (!user) {
            client.database.data.findOne({ case: `afk` }, async function (error, result) {
                if (error) { client.error(error); };
                if (!result) { return client.src.db(null, `afk`); };
                let status = result.data.find(mem => mem.auth === user.id);
                if (status) {
                    result.data = result.data.filter(mem => mem.auth !== user.id);
                    let res = { $set: { data: result.data } };
                    client.database.data.updateOne({ case: `afk` }, res, function (error) { if (error) { client.src.error(error); }; });
                }
            })
        }
    },
    async guildDelete(guild) {
        if (client.db) { client.database.guilds.findOne({ id: guild.id }, function (error, result) { if (error) { client.error(error); }; if (result) { leave(result.prefix, result.data.length, result.badges.length); } else { leave(); } }); } else { leave(); };
        async function leave(list) {
            let field = [];
            field.push(`${client.arrow} Guild Name: ${guild.name}`);
            field.push(`${client.arrow} Guild ID: ${guild.id}`);
            field.push(`${client.arrow} Members: ${guild.memberCount - 1}`);
            field.push(`${client.arrow} Humans: ${guild.members.cache.filter(member => !member.user.bot).size}`);
            field.push(`${client.arrow} Bots: ${guild.members.cache.filter(member => member.user.bot).size - 1}`);
            field.push(`${client.arrow} Owner Name: ${guild.owner.user.tag}`);
            field.push(`${client.arrow} Owner ID: ${guild.owner.user.id}`);
            field.push(`${client.arrow} Used Database: ${list ? `Yes` : `No`}`);
            field.push(`${client.arrow} Server Prefix: ${list ? list[0] : client.prefix}`);
            field.push(`${client.arrow} Valkyries Count: ${list ? list[1].toLocaleString() : 0}`);
            field.push(`${client.arrow} Badges Count: ${list ? list[2].toLocaleString() : 0}`);
            const embed = client.embed().setAuthor(`Guild Lost!`).setDescription(field.join(`\n`));
            client.channels.cache.get(client.util.id.guilds).send(embed);
        }
        client.database.guilds.deleteOne({ id: guild.id }, function (error) { if (error) { client.error(error); }; });
    },
    key() {
        let Discord = require(`discord.js`), keys = [{ case: `<>`, data: `Aliases, keywords that can also trigger the command` }, { case: `[]`, data: `Required input, without this input the command would not function as it should` }, { case: `()`, data: `Optional input, without this input the command would still function properly` }, { case: `TIN`, data: `Troubleshooting Identification Number (User ID for logs)` }],
            codes = [`Author permission / Author role error`, `Client permission / Client role error`, `Connection error`, `Command disabled`, `Command error`, `Channel error / command invalid in channel`, `Invalid input / Invalid command`, `Code error - Report to support [here](${client.util.link.support})`, `Member error / Member does not exist`, `Channel does not exist`, `Channel already exists`, `User / member not mentioned`, `Role not mentioned`, `DEV ONLY`, `Role already given`, `OWNER ONLY`];
        client.error.code = new Discord.Collection();
        client.keys = new Discord.Collection();
        for (let i = 0; i < codes.length; i++) { client.error.code.set(i + 1, codes[i]); }
        keys.forEach(key => { client.keys.set(key.case, key); });
    },
    rank() {
        client.database.config.findOne({ case: `data` }, async function (error, result) {
            if (error) { client.error(error); };
            let Discord = require(`discord.js`);
            client.ranks = new Discord.Collection();
            result.data.forEach(group => { client.ranks.set(group.rank, client.src.clean(group.desc)); });
            client.ranks.set(0, `Villagers`);
        })
    },
    honkai() {
        let role = client.guilds.cache.get(`641709561430016002`).roles.cache.get(`722552500754055241`);
        const embed = client.embed()
            .setTitle(`***REMINDER***`)
            .setDescription(`${client.user.username} says don't be lazy, or you will be kicked out of the armada, run sim battle and quantum sea.`)
        client.channels.cache.get(`722553066011885619`).send(role.toString(), embed);
    },
    data() {
        return [
            { "case": "owners", "rank": 8, "desc": "owner of %B%", "data": ["476812566530883604", "568824243396149248"] },
            { "case": "developers", "rank": 7, "desc": "developer of %B%", "data": ["476812566530883604", "568824243396149248", "272442568275525634", "189238841054461952"] },
            { "case": "moderators", "rank": 6, "desc": "moderator of %B%'s server", "data": ["476812566530883604", "568824243396149248", "272442568275525634", "189238841054461952", "234914515106529283"] },
            { "case": "approved", "rank": 5, "desc": "approved member of %B%", "data": ["476812566530883604", "568824243396149248", "272442568275525634", "189238841054461952", "234914515106529283"] },
            { "case": "host", "rank": 4, "desc": "host support/donator [Supporter]", "data": ["226594042991869953", "285529425205002251"] },
            { "case": "alder", "rank": 3, "desc": "teir 3 patreon subscriber [Alder]", "data": ["226594042991869953", "285529425205002251"] },
            { "case": "gate keeper", "rank": 2, "desc": "teir 2 patreon subscriber [Gate Keeper]", "data": [] },
            { "case": "shrine maiden", "rank": 1, "desc": "teir 1 patreon subscriber [Shrine Maiden]", "data": [] }
        ]
    },
}

// Mobile Status
// Go to: \node_modules\discord.js\src\util\Constants.js
// Edit this: $browser: 'Discord Android',  
