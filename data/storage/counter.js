let [{ readdir, readFile }, sloc] = [require(`fs`), require(`sloc-count`)]

module.exports = async (client, path) => {
    let getLines = async () => {
        let lines = 0
        return new Promise(async (resolve) => {
            let read = async (dir) => {
                readdir(dir, async (err, files) => {
                    if (err) console.log(err)
                    if (!Array.isArray(files)) return null
                    for await (let file of files.filter(c => ![`package.json`, `package-lock.json`, `node_modules`].includes(c))) {
                        if (file.endsWith(`.js`)) readFile(`${dir}/${file}`, `utf8`, (err, data) => {
                            let count = sloc(data).total
                            lines += count
                            let cmd = client.commands.find(file.substring(0, file.lastIndexOf(`.`)), client)
                            if (cmd) client.commands.set(file.substring(0, file.lastIndexOf(`.`)), Object.mergify(cmd, { lines: count }))
                        })
                        else if (!file.includes(`.`)) read(`${dir}/${file}`)
                    }
                })
            }
            await read(path || `./`).catch(() => { })
            setTimeout(() => resolve(lines), 1000)
        })
    }
    client.lines = await getLines()
}