module.exports.run = async (client, message, args) => {
    client.src.nsfw(message, `This is not a command with any NSFW content, it is merely to check which channels of a server have NSFW enabled`);
    return client.log(message);
}

module.exports.code = {
    title: "nsfwcheck",
    about: "Get the list of NSFW channels in a server",
    usage: ["%P%nsfwcheck"],
}