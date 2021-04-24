let moment = require(`moment`)
require(`moment-duration-format`)(moment)

module.exports = async (message, client, time, guild) => {
	if (message.author.bot) return
	if (message.channel.type === `dm`) {
		client.channels.cache.get(client.util.channel.dms).send(client.embed(message).setDescription(message.content))
		if (message.content.toLowerCase().includes(`help`)) return message.channel.send(`The word \`help\` has triggerd this event to run. Here is the support link to the server if needed: ${client.util.link.support}`)
		let [cleverbot, history] = [require(`cleverbot-free`), client.chat.get(message.author.id)]
		switch (!history) {
			case true: {
				client.chat.set(message.author.id, [])
				let data = client.chat.get(message.author.id)
				cleverbot(message.content).then(async response => chat(response, data))
				break
			}
			case false: {
				let data = client.chat.get(message.author.id)
				cleverbot(args.join(` `), data).then(async response => chat(response, data.length > 20 ? data.splice(2) : data))
				break
			}
		}
		function chat(response, data) {
			data.push(message.content)
			data.push(response)
			message.channel.send(response)
			client.chat.set(message.author.id, data)
		}
	}
	client.db._guilds.findOne({ id: message.guild.id }, async (error, guild) => {
		if (error) client.error(error)
		if (!guild) return require(`./src.js`)._create(message)
		if (guild.nitro) {
			const [rawArgs, emojis] = [message.content.split(` `), []]
			for await (let word of rawArgs) {
				await getEmoji(word).then(result => emojis.push(result))
			}
			if (message.content != emojis.join(` `)) sendWebhook(emojis.join(` `))

			async function sendWebhook(emojis) {
				if (emojis.length > 1999) return message.channel.send(`Message length is greater than the discord limit of 2,000`)
				let error = false
				try {
					let webhooks = await message.channel.fetchWebhooks()
					let webhook = webhooks.first()
					if (!webhook) webhook = await message.channel.createWebhook(`Nitro Mockup, by ${client.user.username}`)
					if (!webhook) return message.channel.send(`Missing Permissions: \`Manage Webhooks\``)
					await message.delete().catch(() => { message.channel.send(`Missing Permissions: \`Delete Messages\``); error = true })
					if (!error) {
						await webhook.send(emojis, {
							username: message.guild.members.cache.get(message.author.id).displayName,
							avatarURL: message.author.avatarURL({ format: "png" }),
						})
					}

				} catch (error) { message.channel.send(`Error: \`${error}\``) }
			}

			async function getEmoji(word) {
				if (word.startsWith(`:`) && word.endsWith(`:`) && word !== `::` && word !== `:`) {
					word = word.substring(1, word.length - 1)
					let msgEmoji = message.guild.emojis.cache.find(c => c.name.toLowerCase() === (word.toLowerCase()))
					if (msgEmoji) return msgEmoji

					userGuilds = client.guilds.cache.filter(guild => guild.members.cache.get(message.author.id))
					for (let userGuild of userGuilds) {
						guildEmoji = userGuild[1].emojis.cache.find(c => c.name.toLowerCase() === (word.toLowerCase()))
						if (guildEmoji) return guildEmoji
					}

					guildsEmoji = client.emojis.cache.find(c => c.name.toLowerCase() === (word.toLowerCase()))
					if (guildsEmoji) return guildsEmoji

					return `:${word}:`
				} else return word
			}
		}

		client.db._data.findOne({ case: `afk` }, async (error, result) => { // AFK Commnad
			if (error) client.error(error)
			if (!result) return client.src.create(client.db._data, { case: `afk`, data: [] })
			if (message.mentions.users.first) {
				message.mentions.users.forEach(async person => {
					let status = result.data.find(user => user.auth === person.id)
					if (status) {
						let field = []
						field.push(`\u279c Duration: ${moment.duration(new Date().getTime() - status.time).format(`w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds]`)}`)
						field.push(`\u279c Reason: ${status.data}`)
						field.push(`\u279c Locked: ${status.lock ? `Yes` : `No`}`)
						let msg = await message.channel.send(client.embed().setTitle(`${person.tag} is currently AFK`).setDescription(field.join(`\n`)))
						setTimeout(async () => msg.delete(), 15 * 1000)
						const embed = client.embed()
							.setTitle(`Click here to view the ping!`)
							.setURL(message.url)
							.setDescription(`You have a pending ping while you were AFK, the message was sent by ${message.author.toString()} in ${message.channel.toString()} of guild \`${message.guild.name}\``)
							.addField(`Message`, message.content.length > 800 ? `${message.content.substring(0, 800)}...` : message.content, false)
							.setImage(message.attachments.first() ? message.attachments.first().url : null)
						client.users.cache.get(person.id).send(embed)
					}
				})
			}
			let status = result.data.find(user => user.auth === message.author.id)
			if (status) {
				if (!status.lock && !message.content.startsWith(`${guild.prefix}afk`) && !message.content.startsWith(`${client.prefix}afk`)) {
					client.commands.get(`afk`).run(client, message, [`END`], guild.prefix)
				}
			}
		})
		if (message.content === `(\u256F\u00B0\u25A1\u00B0\uFF09\u256F\uFE35 \u253B\u2501\u253B`) return message.channel.send(`\u252C\u2500\u252C \u30CE( \u309C-\u309C\u30CE)`)
		if (message.content === `\u252C\u2500\u252C \u30CE( \u309C-\u309C\u30CE)`) return message.channel.send(`(\u256F\u00B0\u25A1\u00B0\uFF09\u256F\uFE35 \u253B\u2501\u253B`)
		if (message.content.toLowerCase() === `${client.user.username.toLowerCase()}?` || (message.channel.type !== `dm` && message.content.toLowerCase() === `${message.guild.members.cache.get(client.user.id).displayName.toLowerCase()}?`)) return message.channel.send(`**${client.user.username} online, running master prefix \`${client.prefix}\`**`)
		if (message.content.toLowerCase() === `f`) return client.commands.get(`f`).run(client, message, [], guild)
		if (guild.chatlist && guild.chatlist.length > 0 && guild.chatlist.includes(message.channel.id)) return client.commands.get(`chat`).run(client, message, message.content.split(` `), guild, true).then(() => message.channel.stopTyping())
		if (guild.autodect && message.content.toLowerCase().includes(`osu.ppy.sh`) && (message.content.toLowerCase().includes(`/users/`) || message.content.toLowerCase().includes(`/beatmapsets/`))) return client.commands.get(`osu`).run(client, message, message.content.split(` `), guild, true)
		if ([`<@${client.user.id}>`, `<@!${client.user.id}>`].includes(message.content.split(` `)[0])) return client.commands.get(`prefix`).run(client, message, [], guild)
		if (message.content.toLowerCase().startsWith(client.prefix) || message.content.toLowerCase().startsWith(guild.prefix)) {
			let args = message.content.slice(client.prefix.length).trim().split(/ +/g)
			if (args[0]) {
				let command = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()))
				if (command) {
					let [now, timestamps] = [Date.now(), client.cooldowns.get(command.code.title)]
					if (timestamps.has(message.author.id)) {
						let end = timestamps.get(message.author.id) + ((command.code.cooldown || (guild.premium ? 1 : 4)) * 1000);
						if (now < end) return message.reply(`please wait ${((end - now) / 1000).toFixed(1)} more second(s) before reusing the \`${command.code.title}\` command.`)
					}
					if (guild.blacklist && guild.blacklist.length > 0 && !guild.blacklist.includes(message.channel.id)) return
					if (!client.owners.includes(message.author.id)) timestamps.set(message.author.id, now)
					setTimeout(() => timestamps.delete(message.author.id), (command.code.cooldown || (guild.premium ? 1 : 4)) * 1000)
					args.shift()
					const { monitorEventLoopDelay } = require('perf_hooks')
					const h = monitorEventLoopDelay()
					h.enable()
					command.run(client, message, args, guild).then(() => {
						message.channel.stopTyping(true)
						client.log(message, time, guild)
						h.disable()
						console.log(`Current`, `=>`, formatBytes(process.memoryUsage().rss))
						console.log(`Min`, `=>`, formatBytes(h.min))
						console.log(`Max`, `=>`, formatBytes(h.max))
						console.log(`Mean`, `=>`, formatBytes(h.mean))
						console.log(`stddev`, `=>`, formatBytes(h.stddev))
						console.log(`percentiles`, `=>`, h.percentiles)
						console.log(`percentile(50)`, `=>`, formatBytes(h.percentile(50)))
						console.log(`percentile(99)`, `=>`, formatBytes(h.percentile(99)))


						function formatBytes(bytes) {
							if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(2)}GB`
							else if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(2)}MB`
							else if (bytes >= 1000) return `${(bytes / 1000).toFixed(2)}KB`
							else if (bytes > 1 || bytes < 1) return `${bytes} bytes`
							else return `${bytes} byte`
						}
					})
				}
			}
		}
	})
}



// let moment = require(`moment`); require(`moment-duration-format`)(moment);

// module.exports = async (client, message, prefix, guild) => { // Message event
// 	if (message.content === `(\u256F\u00B0\u25A1\u00B0\uFF09\u256F\uFE35 \u253B\u2501\u253B`) { return message.channel.send(`\u252C\u2500\u252C \u30CE( \u309C-\u309C\u30CE)`); };
// 	if (guild && guild.nitro) {
// 		const rawArgs = message.content.split(' ')
// 		let emojis = []
// 		for (let word of rawArgs) {
// 			await getEmoji(word).then(result => {
// 				emojis.push(result)
// 			})
// 		}

// 		if (message.content != emojis.join(' ')) sendWebhook(emojis.join(` `))

// 		async function sendWebhook(emojis) {
// 			if (emojis.length > 1999) return message.channel.send(`Message length is greater than the discord limit of 2,000`)
// 			let error = false;
// 			const channel = message.channel
// 			try {
// 				const webhooks = await channel.fetchWebhooks();
// 				let webhook = webhooks.first();

// 				if (!webhook) {
// 					webhook = await message.channel.createWebhook(`Nitro Mockup, by ${client.user.username}`)
// 				}

// 				if (!webhook) return message.channel.send(`Missing Permissions: \`Manage Webhooks\``)
// 				await message.delete().catch(() => { message.channel.send(`Missing Permissions: \`Delete Messages\``); error = true })
// 				if (!error) {
// 					await webhook.send(emojis, {
// 						username: message.guild.members.cache.get(message.author.id).displayName,
// 						avatarURL: message.author.avatarURL({ format: "png" }),
// 					})
// 				}

// 			} catch (error) {
// 				message.channel.send(`Error: \`${error}\``)
// 			}
// 		}

// 		async function getEmoji(word) {
// 			if (word.startsWith(`:`) && word.endsWith(`:`) && word !== `::` && word !== `:`) {
// 				word = word.substring(1, word.length - 1)
// 				msgEmoji = message.guild.emojis.cache.find(c => c.name.toLowerCase() === (word.toLowerCase()))
// 				if (msgEmoji) return msgEmoji

// 				userGuilds = client.guilds.cache.filter(guild => guild.members.cache.get(message.author.id))
// 				for (let userGuild of userGuilds) {
// 					guildEmoji = userGuild[1].emojis.cache.find(c => c.name.toLowerCase() === (word.toLowerCase()))
// 					if (guildEmoji) return guildEmoji
// 				}

// 				guildsEmoji =
// 					client.emojis.cache.find(c => c.name.toLowerCase() === (word.toLowerCase()))
// 				if (guildsEmoji) return guildsEmoji

// 				return `:${word}:`
// 			} else { return word }
// 		}
// 	}

// 	let args, field = [];
// 	client.database.data.findOne({ case: `afk` }, async function (error, result) {
// 		if (error) { client.error(error); };
// 		if (!result) { return client.src.db(message, `afk`); };
// 		if (message.mentions.users.first) {
// 			message.mentions.users.forEach(async person => {
// 				let status = result.data.find(user => user.auth === person.id);
// 				if (status) {
// 					field.push(`${client.arrow} Duration: ${moment.duration(new Date().getTime() - status.time).format(`w [Weeks], d [Days], h [Hours], m [Minutes], s [Seconds]`)}`);
// 					field.push(`${client.arrow} Reason: ${status.data}`);
// 					field.push(`${client.arrow} Locked: ${status.lock ? `Yes` : `No`}`);
// 					let msg = await message.channel.send(client.embed().setTitle(`${person.tag} is currently AFK`).setDescription(field.join(`\n`)));
// 					setTimeout(async () => { msg.delete(); }, 15 * 1000);
// 					const embed = client.embed()
// 						.setTitle(`Click here to view the ping!`)
// 						.setURL(message.url)
// 						.setDescription(`You have a pending ping while you were AFK, the message was sent by ${message.author.toString()} in ${message.channel.toString()} of guild \`${message.guild.name}\``)
// 						.addField(`Message`, message.content.length > 800 ? `${message.content.substring(0, 800)}...` : message.content, false)
// 						.setImage(message.attachments.first() ? message.attachments.first().url : null)
// 					client.users.cache.get(person.id).send(embed);
// 				}
// 			})
// 		}
// 		let status = result.data.find(user => user.auth === message.author.id);
// 		if (status) { if (!status.lock && !message.content.startsWith(`${prefix}afk`) && !message.content.startsWith(`${client.prefix}afk`)) { client.commands.get(`afk`).run(client, message, [`END`], prefix, true); }; };
// 	})

// 	if (message.content.toLowerCase().startsWith(prefix.toLowerCase()) || message.content.toLowerCase().startsWith(client.prefix.toLowerCase())) {
// 		args = message.content.slice(prefix.length).trim().split(/ +/g);
// 		args.shift().toLowerCase();
// 		let array = message.content.split(` `), cmd = array[0].toLowerCase(), command = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
// 		if (command) { check(command); };
// 	}
// 	async function check(command) {
// 		// Check if user is in cooldown
// 		let now = Date.now(), timestamps = client.cooldowns.get(command.code.title);
// 		if (timestamps.has(message.author.id)) {
// 			const end = timestamps.get(message.author.id) + ((command.code.cooldown || 3) * 1000);
// 			if (now < end) { return message.reply(`please wait ${((end - now) / 1000).toFixed(1)} more second(s) before reusing the \`${command.code.title}\` command.`); };
// 		}
// 		// Check if user is blacklisted
// 		client.database.data.findOne({ case: `blacklist` }, async function (error, list) {
// 			if (error) { client.error(error); };
// 			if (!list) { return client.src.db(message, `blacklist`); };
// 			if (list.data.includes(message.author.id)) { return message.channel.send(client.src.comment(`Looks like you are blacklisted on ${client.user.username}!`)); };
// 			// Check if command is disabled
// 			client.database.config.findOne({ case: `toggle` }, async function (error, body) {
// 				if (error) { client.error(error); };
// 				if (body.cmds.includes(command.code.title)) { return message.channel.send(client.embed().setColor(client.util.id.failed).setTitle(`**\`Command Disabled\`**`).setURL(client.util.link.support).addField(`Need Help?`, `[Click Here!](${client.util.link.support})`).setImage(client.util.link.disabled)); };
// 				if (body.groups.includes(command.group)) { return message.channel.send(client.embed().setColor(client.util.id.failed).setTitle(`**\`Command Group Disabled\`**`).setURL(client.util.link.support).addField(`Need Help?`, `[Click Here!](${client.util.link.support})`).setImage(client.util.link.disabled)); };
// 				// Set cooldown for user, disregard if approved user, as well as run the command file
// 				client.database.config.findOne({ case: `data` }, async function (error, result) {
// 					if (error) { client.error(error); };
// 					if (!result) { return client.src.db(message, `data`, client.function.data(), null, client.database.config); };
// 					let approved = result.data.find(group => group.rank === 5);
// 					if (!command.code.dm && message.channel.type === `dm`) { message.channel.send(client.src.comment(`This command is not open in DMs!`)); return client.log(message); }; // Check if command is allowed in DMs
// 					if (command.code.nsfw && message.channel.type !== `dm` && !message.channel.nsfw) return client.src.nsfw(message); // Check if command is NSFW 
// 					let restrict, developer = result.data.find(group => group.rank === 7), owner = result.data.find(group => group.rank === 8), rank = command.code.ranks || 0;
// 					if (rank === developer.rank && !developer.data.includes(message.author.id)) { restrict = 14; };
// 					if (rank === owner.rank && !owner.data.includes(message.author.id)) { restrict = 16; };
// 					// Check if bot is currently running
// 					client.database.config.findOne({ case: `status` }, async function (error, result) {
// 						if (error) { client.error(error); };
// 						if (!result) { return client.src.db(message, `status`, true, null, client.database.config); };
// 						if (!result.data && !developer.data.includes(message.author.id)) { return message.channel.send(client.src.comment(`${client.user.username} is currently disabled!`)); };
// 						if (restrict) { message.channel.send(client.src.comment(`You are not permitted to use this command\n\'Code: ${restrict}\' - \'${prefix}errcodes\' for more information`)); return client.src.log(message); }
// 						else {
// 							if (!approved.data.includes(message.author.id)) { timestamps.set(message.author.id, now); setTimeout(() => timestamps.delete(message.author.id), (command.code.cooldown || 3) * 1000); };
// 							let array = message.content.split(` `), cmd = array[0].toLowerCase(), postcommand = cmd.slice(prefix.length);
// 							try { command.run(client, message, args, prefix); /* client.statcord.postCommand(postcommand, message.author.id); */ } catch (error) { client.error(error); return message.channel.send(client.src.comment(`There was an error trying to execute that command!\nERROR: ${error}`)); };
// 							client.database.config.findOne({ case: `count` }, async function (error, result) {
// 								if (error) { client.error(error); };
// 								if (!result) { return client.src.db(message, `count`, 0, null, client.database.config); };
// 								result.data++;
// 								let res = { $set: { data: result.data } };
// 								client.database.config.updateOne({ case: `count` }, res, function (error) { if (error) { client.src.error(error); }; });
// 							})
// 						}
// 					})
// 				})
// 			})
// 		})
// 	}
// }