let [moment, { Api }] = [require(`moment`), require(`node-osu`)]
require(`moment-duration-format`)(moment)

module.exports.run = async (client, message, args, guild, detect) => {
    let [millify, key] = [require(`millify`)]
    if (!args[0]) return client.src.invalid(message, module.exports.code.title, guild)
    if (detect) args = linker()
    const osu = new Api(Buffer.from(process.env.API_OSU, `base64`).toString(`ascii`), { notFoundAsError: false, completeScores: false, parseNumeric: false })
    let input = args.join(` `)
    if (args[0].toLowerCase() === `user` || args[0].toLowerCase() === `profile` || args[0].toLowerCase() === `beatmap`) {
        input = args.splice(1).join(` `)
        key = args.shift().toLowerCase()
    } else if (args.join(` `).includes(`/users/`)) {
        key = `user`
        input = input.substring(input.lastIndexOf(`/`) + 1)
    } else if (args.join(` `).includes(`/beatmapsets/`)) {
        key = `beatmap`
        input = input.substring(input.lastIndexOf(`/`) + 1)
    }

    if (key) {
        switch (key) {
            case `beatmap`: {
                osu.getBeatmaps({ b: input }).then(async data => data[0] ? output({ type: `beatmap`, data: data }) : output({ type: `error`, data: `No data found` }))
                break
            }
            default: {
                osu.getUser({ u: input }).then(async data => data && !Array.isArray(data) ? output({ type: `user`, data: data, canvas: key === `profile` ? true : false }) : output({ type: `error`, data: `No data found` }))
                break
            }
        }
    } else {
        osu.getBeatmaps({ b: input }).then(async data => {
            data[0] ? output({ type: `beatmap`, data: data }) : osu.getUser({ u: input }).then(async data => {
                data && !Array.isArray(data) ? output({ type: `user`, data: data }) : output({ type: `error`, data: `No data found` })
            })
        })
    }

    async function output(info) {
        switch (info.type) {
            case `user`: {
                switch (info.canvas) {
                    case true: {
                        canvas(info)
                        break
                    }
                    default: {
                        let [field, lookup] = [[], require(`country-code-lookup`).byIso(info.data.country)]
                        field.push(`\u279c Name: [${info.data.name}](https://osu.ppy.sh/users/${info.data.id})`)
                        field.push(`\u279c Scores: [Ranked: ${parseInt(info.data.scores.ranked).toLocaleString() || `N/A`} | Total: ${parseInt(info.data.scores.total).toLocaleString() || `N/A`}]`)
                        field.push(`\u279c PP: [Raw: ${parseInt(info.data.pp.raw).toLocaleString() || `N/A`} | Rank: ${parseInt(info.data.pp.rank).toLocaleString() || `N/A`} | Country Rank: ${parseInt(info.data.pp.countryRank).toLocaleString() || `N/A`}]`)
                        field.push(`\u279c Country: [${info.data.country}] ${guild.premium ? (lookup.country ? lookup.country : ``) : ``}`)
                        field.push(`\u279c Level: ${info.data.level}`)
                        field.push(`\u279c Accuracy: ${parseFloat(info.data.accuracy) ? (guild.premium ? parseFloat(info.data.accuracy).toFixed(4) : parseFloat(info.data.accuracy).toFixed(2)) : `N/A`}`)
                        field.push(`\u279c Seconds Played: ${parseInt(info.data.secondsPlayed).toLocaleString()}`)
                        field.push(`\u279c Join Date: ${info.data.raw_joinDate}`)
                        message.channel.send(client.embed().setAuthor(`OSU User Info`, null, client.util.link.support).setDescription(field.join(`\n`)))
                        break
                    }
                }
                break
            }
            case `beatmap`: {
                // https://assets.ppy.sh/beatmaps/1174631/covers/cover.jpg
                info.data = info.data[0]
                let field = []
                field.push(`\u279c Name: [${info.data.title} by: ${info.data.creator}](https://osu.ppy.sh/beatmapsets/${info.data.beatmapSetId}#osu/${info.data.id})`)
                field.push(`\u279c Version: ${info.data.version}`)
                field.push(`\u279c Stats: [Max Combo: ${parseInt(info.data.maxCombo).toLocaleString()} | Difficulty: ${parseFloat(info.data.difficulty.rating).toFixed(2)}]`)
                field.push(`\u279c Played: ${parseInt(info.data.counts.plays).toLocaleString()} times`)
                field.push(`\u279c Objects: [Normal: ${parseInt(info.data.objects.normal).toLocaleString()} | Slide: ${parseInt(info.data.objects.slider).toLocaleString()} | Spin: ${parseInt(info.data.objects.spinner).toLocaleString()}]`)
                field.push(`\u279c Data: [Rating: ${parseFloat(info.data.rating).toFixed(2)}/10 | BPM: ${parseInt(info.data.bpm).toLocaleString()}]`)
                if (guild.premium) {
                    field.push(`\u279c ${info.data.hasDownload ? `\`\u2714\uFE0F\`` : `\`\u274C\``} Downloadable`)
                    field.push(`\u279c ${info.data.hasAudio ? `\`\u2714\uFE0F\`` : `\`\u274C\``} Audio`)
                    field.push(`\u279c Other: [Aim: ${parseFloat(info.data.difficulty.aim).toFixed(2)} | Speed: ${parseFloat(info.data.difficulty.speed).toFixed(2)} | Size: ${parseFloat(info.data.difficulty.size).toFixed(2)} | Overall: ${parseFloat(info.data.difficulty.overall).toFixed(2)}]`)
                }
                message.channel.send(client.embed().setAuthor(`OSU Beatmap Info`, null, client.util.link.support).setDescription(field.join(`\n`)))
                break
            }
            case `error`: {
                message.channel.send(client.comment(`ERROR: ${info.data}`))
                break
            }
        }
    }

    async function canvas(info) {
        let [{ registerFont, createCanvas, loadImage }, { MessageAttachment }, image] = [require(`canvas`), require(`discord.js`)]
        registerFont(`./data/font.ttf`, { family: `JetBrains Mono` })
        let canvas = createCanvas(1000, 300)
        let ctx = canvas.getContext(`2d`)
        ctx.strokeStyle = `#151515`
        ctx.fillStyle = `#151515`
        let lvlpercent = info.data.level.split(`.`)[1].substring(0, 2)
        curved(ctx, 0, 0, canvas.width, canvas.height, { tl: 25, tr: 25, br: parseInt(lvlpercent) > 99 ? 10 : 25, bl: 10 }, true)
        ctx.strokeStyle = message.member.displayHexColor
        ctx.fillStyle = message.member.displayHexColor
        if (parseInt(lvlpercent) > 5) curved(ctx, 0, canvas.height - 10, (parseInt(lvlpercent) * canvas.width) / 100, 10, { tl: 0, tr: parseInt(lvlpercent) > 99 ? 0 : 5, br: parseInt(lvlpercent) > 99 ? 10 : 5, bl: 10 }, true)
        image = await loadImage(`./data/osu.png`).catch((error) => client.error(error))
        ctx.drawImage(image, 20, 20, 50, 50)
        ctx.save()
        ctx.beginPath()
        ctx.arc(135, 150, 100, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.clip()
        image = await loadImage(`https://a.ppy.sh/${info.data.id}`).catch((error) => client.error(error))
        ctx.drawImage(image, 35, 50, 200, 200)
        ctx.restore()
        ctx.font = `40px "JetBrains Mono"`
        let name = info.data.name.length > 27 ? `${info.data.name.substring(0, 24)}...` : info.data.name
        ctx.strokeStyle = `#252525`
        ctx.fillStyle = `#252525`
        image = await loadImage(`https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-united-states_1f1fa-1f1f8.png`).catch((error) => client.error(error))
        ctx.drawImage(image, canvas.width - 55, 10, 40, 40)
        ctx.fillStyle = `#C0C0C0`
        ctx.fillText(name, 270, 70)
        ctx.font = `20px "JetBrains Mono"`
        let level = ctx.measureText(`${parseInt(lvlpercent)}%`).width
        ctx.fillText(`${parseInt(lvlpercent)}%`, ((lvlpercent * canvas.width) / 100) - (level * 2) < 0 ? 10 : (((lvlpercent * canvas.width) / 100) - (level * 2) > canvas.width - ctx.measureText(`Level: ${parseInt(info.data.level)}`).width - 10 ? canvas.width - ctx.measureText(`Level: ${parseInt(info.data.level)}`).width - level - 20 : ((lvlpercent * canvas.width) / 100) - level), canvas.height - 25)
        ctx.fillText(`Level: ${parseInt(info.data.level)}`, canvas.width - ctx.measureText(`Level: ${parseInt(info.data.level)}`).width - 10, canvas.height - 25)
        ctx.fillText(`Accuracy: ${parseFloat(info.data.accuracy).toFixed(2).toLocaleString()}%`, 270, 115)
        ctx.fillText(`Rank: ${parseInt(info.data.pp.rank) > 1000000 ? millify.default(parseInt(info.data.pp.rank)) : parseInt(info.data.pp.rank).toLocaleString()}(G), ${millify.default(parseInt(info.data.pp.countryRank))}(C)`, 270 + ((canvas.width - 270) / 3), 115)
        ctx.fillText(`Plays: ${parseInt(info.data.counts.plays) > 1000000 ? millify.default(parseInt(info.data.counts.plays)) : parseInt(info.data.counts.plays).toLocaleString()}`, 270, 145)
        ctx.fillText(`Score: ${millify.default(parseInt(info.data.scores.ranked))}(R), ${millify.default(parseInt(info.data.scores.total))}(T)`, 270 + ((canvas.width - 270) / 3), 145)
        ctx.fillText(`PP: ${parseInt(info.data.pp.raw).toLocaleString()}`, 270, 175)
        ctx.fillText(`SSH ${parseInt(info.data.counts.SSH).toLocaleString()} SS ${parseInt(info.data.counts.SS).toLocaleString()} SH ${parseInt(info.data.counts.SH).toLocaleString()} S ${parseInt(info.data.counts.S).toLocaleString()} A ${parseInt(info.data.counts.A).toLocaleString()}`, 270 + ((canvas.width - 270) / 3), 175)
        ctx.fillText(`Playtime: ${moment.duration(parseInt(info.data.secondsPlayed) * 1000).format(`w [Weeks], d [Days], h [Hrs], m [Mins], s [Secs]`)}`, 270, 205)
        ctx.fillText(`Provided By: ${client.user.tag}`, 270, 235)
        attachment = new MessageAttachment(canvas.toBuffer(), `profile.png`)
        await message.channel.send(attachment)
    }

    function curved(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === `undefined`) stroke = true
        if (typeof radius === `undefined`) radius = 5
        if (typeof radius === `number`) radius = { tl: radius, tr: radius, br: radius, bl: radius }
        else {
            let defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 }
            for (let side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side]
            }
        }
        ctx.beginPath()
        ctx.moveTo(x + radius.tl, y)
        ctx.lineTo(x + width - radius.tr, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
        ctx.lineTo(x + width, y + height - radius.br)
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
        ctx.lineTo(x + radius.bl, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
        ctx.lineTo(x, y + radius.tl)
        ctx.quadraticCurveTo(x, y, x + radius.tl, y)
        ctx.closePath()
        if (fill) ctx.fill()
        if (stroke) ctx.stroke()
    }
    
    function linker() {
        for (let arg of args) {
            if (arg.toLowerCase().includes(`osu.ppy.sh`) && (arg.toLowerCase().includes(`/users/`) || arg.toLowerCase().includes(`/beatmapsets/`))) return [arg]
        }
    }
}

module.exports.code = {
    title: "osu",
    about: "Information for [OSU! BEATMAP OR USER]",
    usage: ["%P%osu [OSU! BEATMAP OR USER]"]
}