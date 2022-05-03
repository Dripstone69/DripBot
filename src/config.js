module.exports = {
    prefix: "your bot prefix",
    mongo: process.env.MONGO || "mongo connection URL here",
    slashGlobal: false,
    testGuildID: "guild id for slash commands",
    ownerID: "owner id here",
    token: process.env.TOKEN || "bot token here"
}
