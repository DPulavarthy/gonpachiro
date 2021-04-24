module.exports.run = async (client, message, args, guild) => {
    let [time, loading, cmd, word] = [new Date().getTime(), await message.channel.send(client.src.loading({ loading: false })), message.content.slice(message.client.prefix.length).trim().split(/ +/g)[0]]
    let load = loading.createdTimestamp - message.createdTimestamp
    switch (cmd.toLowerCase()) {
        case `ding`: {
            word = `${String.fromCodePoint(128276)} Dong!`
            break
        }
        case `beep`: {
            word = `${String.fromCodePoint(128009)} Boop!`
            break
        }
        case `ping`: {
            word = `${String.fromCodePoint(127955)} Pong!`
            break
        }
    }
    let data = client.data.get(module.exports.code.title)
    data.push(load)
    await chart(data)
    data.pop()
    let [field, { MessageAttachment }, db] = [[], require(`discord.js`), new Date().getTime()]
    let attachment = new MessageAttachment(`./data/ping.png`, `ping.png`)
    client.db._guilds.findOne({ id: message.guild.id }, async (error, result) => {
        if (error) client.error(error)
        field.push(`Latency is ${load.toLocaleString()} ms`)
        field.push(`API Latency is ${Math.round(client.ws.ping).toLocaleString()} ms`)
        field.push(`Server Latency is ${message.channel.type === `dm` ? `not avaliable in DMs` : `${Math.round(message.guild.shard.ping).toLocaleString()} ms`}`)
        field.push(`Command Runtime is ${(new Date().getTime() - time).toLocaleString()} ms`)
        field.push(`Database Latency is ${(new Date().getTime() - db).toLocaleString()} ms`)
        loading.delete()
        message.channel.send(client.embed().setDescription(`${client.src.code(word)}${client.src.code(field.join(`\n`), `js`)}`).attachFiles(attachment).setImage(`attachment://ping.png`)).then(async () => require(`fs`).unlinkSync(`./data/ping.png`))
    })

    async function chart(data) {
        let { registerFont, createCanvas, loadImage } = require(`canvas`)
        registerFont(`./data/font.ttf`, { family: `JetBrains Mono` })
        let [canvas, main, opposite, font, old, follow, i, j, max] = [createCanvas(1000, 500), `#191919`, `#C0C0C0`, 70, [], true, 1, 8, Math.max(...data)]
        let ctx = canvas.getContext(`2d`)
        ctx.fillStyle = opposite
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        type(client.user.tag, 77, 20, 30)
        let image = await loadImage(`./data/logo.png`)
        ctx.drawImage(image, 155, 0, 25, 25)
        type(module.exports.code.title.toUpperCase(), (canvas.width / 2), 70, 70)
        type(`0`, 55, canvas.height - 55)
        ctx.lineWidth = 5
        ctx.strokeStyle = main
        ctx.beginPath()
        ctx.moveTo(70, 130)
        ctx.lineTo(70, canvas.height - 70)
        ctx.lineTo(canvas.width - 70, canvas.height - 70)
        ctx.stroke()
        type(`X mins ago`, canvas.width / 2, canvas.height - 10)
        let metrics = ctx.measureText(`X ms`)
        ctx.save()
        ctx.translate(35, metrics.width / 2)
        ctx.rotate(-Math.PI / 2)
        ctx.textAlign = `center`
        ctx.fillText(`X ms`, -250, (canvas.height / 2) - 265)
        ctx.fillText(max, -125, (canvas.height / 2) - 230)
        ctx.fillText(max / 2, -265, (canvas.height / 2) - 230)
        ctx.restore()

        while (follow) {
            if (i % 2 !== 0) draw(60, 140 + (i * 10), canvas.width - 80, 140 + (i * 10))
            i++
            if (140 + (i * 10) >= canvas.height - font) follow = false
        }
        reset()

        while (follow) {
            if (i % 2 === 0) draw(70 + (i * 10), 140, 70 + (i * 10), canvas.height - 60)
            if ((i - 1) % 10 === 0) {
                if (j === 0) type(`NOW`, 70 + (i * 10) + 13, canvas.height - 40)
                else type(j, 70 + (i * 10) + 10, canvas.height - 40)
                j--
            }
            i++
            if (140 + (i * 10) >= canvas.width) follow = false
        }
        reset()

        while (follow) {
            if ((i - 1) % 10 === 0) {
                callLine(data.length - j - 1, i)
                j--
            }
            i++
            if (140 + (i * 10) >= canvas.width) follow = false
        }
        reset()

        while (follow) {
            if ((i - 1) % 10 === 0) {
                callPoint(data.length - j - 1, i)
                j--
            }
            i++
            if (140 + (i * 10) >= canvas.width) follow = false
        }

        require(`fs`).writeFileSync(`./data/ping.png`, canvas.toBuffer())

        function callPoint(index, loc) {
            let [cmin, cmax] = [150, canvas.height - 70]
            let [crange, per] = [cmax - cmin, (data[index] * 100) / max]
            if (isNaN(per)) return
            let [x, y] = [70 + (loc * 10) + (5 / 2), canvas.height - 70 - (15 / 2) - ((per / 100) * crange)]
            circle(x, y, 15)
            type(data[index], x + 5, cmin - 21.5)
        }

        function callLine(index, loc) {
            let [cmin, cmax] = [150, canvas.height - 70]
            let [crange, per] = [cmax - cmin, (data[index] * 100) / max]
            if (isNaN(per)) return
            let [x, y] = [70 + + (loc * 10) + (5 / 2), canvas.height - 70 - (15 / 2) - ((per / 100) * crange)]
            connect(old.length < 1 ? null : old, x + (15 / 2), y + (15 / 2))
            old = [x + (15 / 2), y + (15 / 2)]
        }

        function connect(old, newx, newy) {
            if (!old) return
            ctx.lineWidth = 6
            ctx.strokeStyle = main
            ctx.beginPath()
            ctx.moveTo(old[0], old[1])
            ctx.lineTo(newx, newy)
            ctx.stroke()
            ctx.lineWidth = 2
            ctx.strokeStyle = client.util.id.main
            ctx.beginPath()
            ctx.moveTo(old[0], old[1])
            ctx.lineTo(newx, newy)
            ctx.stroke()
        }

        function reset() {
            follow = true
            i = 1
            j = 8
        }

        function type(text, width, height, format) {
            ctx.font = write(text, format)
            ctx.fillStyle = main
            ctx.fillText(text, width, height)
        }

        function circle(x, y, size) {
            ctx.beginPath()
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI, false)
            ctx.fillStyle = client.util.id.main
            ctx.fill(); ctx.lineWidth = 2
            ctx.strokeStyle = main
            ctx.stroke()
        }

        function draw(startx, starty, movex, movey) {
            ctx.lineWidth = 2
            ctx.strokeStyle = main
            ctx.beginPath()
            ctx.moveTo(startx, starty)
            ctx.lineTo(movex, movey)
            ctx.stroke()
        }

        function write(text, type) {
            do {
                ctx.font = `${type === font ? font - 10 : font / 3}px "JetBrains Mono"`
                ctx.textAlign = `center`
            } while (ctx.measureText(text).width > 180)
            return ctx.font
        }
    }
}

module.exports.code = {
    title: "ping",
    about: "Latency + API Latency + Server Latency",
    usage: ["%P%ping", "%P%beep", "%P%ding"],
    alias: ["beep", "ding"]
}