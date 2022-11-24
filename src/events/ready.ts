module.exports = {
    name: "ready",
    once: true,
    execute(logger, client) {
        logger.log(`Logged in as ${client.user.tag}`)
    }
}