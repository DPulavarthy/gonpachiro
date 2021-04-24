let [{ MessageAttachment }, { unlinkSync, writeFileSync }] = [require(`discord.js`), require(`fs`)]

module.exports.run = async (client, message, args) => {
    let [time, loading, word] = [new Date().getTime(), await message.channel.send(client.embed().setTitle(`Loading...`))]
    switch (args.command.toLowerCase()) {
        case `ping`: {
            word = `\uD83C\uDFD3 Pong!`
            break
        }
        case `beep`: {
            word = `\uD83D\uDC09 Boop!`
            break
        }
        case `ding`: {
            word = `\uD83D\uDECE\uFE0F Dong!`
            break
        }
    }
    let [data, load] = [client.data.get(module.exports.data.title), loading.createdTimestamp - message.createdTimestamp < 0 ? 0 : loading.createdTimestamp - message.createdTimestamp]
    data.push(load)
    await chart(data)
    let [db, field, attachment] = [new Date().getTime(), new Array(), new MessageAttachment(`./data/assets/ping.png`, `ping.png`)]
    await client.db._guilds.findOne({ id: message.guild.id })
    let equalify = client.src.equalify(client.ws.ping, load, data.reduce((a, b) => a + b) / data.length, new Date().getTime() - time, new Date().getTime() - db, Math.max(...data), Math.min(...data))
    for (let i = 0; i < equalify.length; i++) if (equalify[i].includes(`.`)) equalify[i] = equalify[i].substring(0, equalify[i].indexOf(`.`))
    field.push(`\u279c Discord Latency is :: ${equalify[0]} ms`)
    field.push(`\u279c Message Latency is :: ${equalify[1]} ms`)
    field.push(`\u279c Average Latency is :: ${equalify[2]} ms`)
    field.push(`\u279c Command Latency is :: ${equalify[3]} ms`)
    field.push(`\u279c MongoDB Latency is :: ${equalify[4]} ms`)
    field.push(`\u279c ${equalify[5] === equalify[6] ? `Max/Min` : `Maximum`} Latency is :: ${equalify[5]} ms`)
    field.push(`${equalify[5] === equalify[6] ? `` : `\u279c Minimum Latency is :: ${equalify[6]} ms`}`)
    loading.delete()
    message.channel.send(client.embed().setDescription(`${client.codeify(`${word}, Hello There${message._guild.premium || message._author ? ` Premium User` : ``}!`)}${client.codeify(field.join(`\n`), `asciidoc`)}`).attachFiles(attachment).setImage(`attachment://ping.png`)).then(() => unlinkSync(`./data/assets/ping.png`))

    async function chart(data) {
        let { registerFont, createCanvas, loadImage } = require(`canvas`)
        registerFont(`./data/assets/font.ttf`, { family: `JetBrains Mono` })
        let [canvas, main, opposite, font, old, follow, i, j, max] = [createCanvas(1000, 500), `#191919`, `#C0C0C0`, 70, new Array(), true, 1, 8, Math.max(...data)]
        let [callPoint, callLine, connect, reset, type, circle, draw, write] = [
            (index, loc) => {
                let [cmin, cmax] = [150, canvas.height - 70]
                let [crange, per] = [cmax - cmin, (data[index] * 100) / max]
                if (isNaN(per)) return
                let [x, y] = [70 + (loc * 10) + (5 / 2), canvas.height - 70 - (15 / 2) - ((per / 100) * crange)]
                circle(x, y, 15)
                type(data[index], x + 5, cmin - 21.5)
            },
            (index, loc) => {
                let [cmin, cmax] = [150, canvas.height - 70]
                let [crange, per] = [cmax - cmin, (data[index] * 100) / max]
                if (isNaN(per)) return
                let [x, y] = [70 + + (loc * 10) + (5 / 2), canvas.height - 70 - (15 / 2) - ((per / 100) * crange)]
                connect(old.length < 1 ? null : old, x + (15 / 2), y + (15 / 2))
                old = [x + (15 / 2), y + (15 / 2)]
            },
            (old, newx, newy) => {
                if (!old) return
                ctx.lineWidth = 6
                ctx.strokeStyle = main
                ctx.beginPath()
                ctx.moveTo(old[0], old[1])
                ctx.lineTo(newx, newy)
                ctx.stroke()
                ctx.lineWidth = 2
                ctx.strokeStyle = client.util.main
                ctx.beginPath()
                ctx.moveTo(old[0], old[1])
                ctx.lineTo(newx, newy)
                ctx.stroke()
            },
            () => {
                follow = true
                i = 1
                j = 8
            },
            (text, width, height, format) => {
                ctx.font = write(text, format)
                ctx.fillStyle = opposite
                ctx.fillText(text, width + 1, height + 1)
                ctx.fillStyle = main
                ctx.fillText(text, width, height)
            },
            (x, y, size) => {
                ctx.beginPath()
                ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI, false)
                ctx.fillStyle = client.util.main
                ctx.fill(); ctx.lineWidth = 2
                ctx.strokeStyle = main
                ctx.stroke()
            },
            (startx, starty, movex, movey) => {
                ctx.lineWidth = 2
                ctx.strokeStyle = main
                ctx.beginPath()
                ctx.moveTo(startx, starty)
                ctx.lineTo(movex, movey)
                ctx.stroke()
            },
            (text, type) => {
                do {
                    ctx.font = `${type === font ? font - 10 : font / 3}px "JetBrains Mono"`
                    ctx.textAlign = `center`
                } while (ctx.measureText(text).width > 180)
                return ctx.font
            }
        ]
        let ctx = canvas.getContext(`2d`)
        ctx.fillStyle = opposite
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        let image = await loadImage(`./data/assets/logo.png`)
        ctx.drawImage(image, 0, 0, 1000, 500)
        type(args.command.toUpperCase(), (canvas.width / 2), 70, 70)
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

        writeFileSync(`./data/assets/ping.png`, canvas.toBuffer())
    }
}

module.exports.data = {
    title: `ping`,
    about: `Latency + API Latency + Server Latency`,
    alias: [`beep`, `ding`]
}