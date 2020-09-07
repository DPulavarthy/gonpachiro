module.exports.run = async (client, message, args, prefix) => { client.src.update(); }

module.exports.code = {
    title: "/hirofix",
    about: "Restart or run bot connections",
    usage: ["%P%/hirofix"],
    ranks: 7,
    dm: true,
}