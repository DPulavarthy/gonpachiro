let [time, { Client, Intents }, res] = [new Date().getTime(), require(`discord.js`), `./res`]
require(`dotenv`).config()
require(`./node_modules/discord.js/src/util/Constants`).DefaultOptions.ws.properties.$browser = `Discord Android`
let client = new Client({ disableMentions: `everyone`, messageCacheLifetime: 60, messageCacheMaxSize: 50, messageSweepInterval: 60, ws: { intents: Intents.ALL } })
require(`colors`).setTheme({ errors: `red`, progrm: `yellow`, system: `brightGreen`, logger: `brightMagenta` })
require(`${res}/db.js`)(client, time)
require(`${res}/cmd.js`)(client, time)
client
    .on(`ready`, async () => require(`${res}/src.js`).startup(client, time))
    .on(`message`, async message => require(`${res}/msg.js`)(message, client, new Date().getTime()))
    .login(Buffer.from(process.env.TOKEN, `base64`).toString(`ascii`))
    // An extra comment for example purposes