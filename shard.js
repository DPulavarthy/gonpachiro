let time = new Date().getTime()
require(`colors`)
require(`dotenv`).config()
let { ShardingManager } = require(`discord.js`)
let manager = new ShardingManager(`./${require(`./package.json`).main}`, { token: process.env.TOKEN })
manager.on(`shardCreate`, async shard => console.log(`[SHARDS]: [${((new Date().getTime() - time) / 1000).toFixed(2)}s] Shard [${shard.id}] online`.yellow))
manager.spawn()