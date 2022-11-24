const { loadConfig, loadPlayers, loadQuests, saveConfig, savePlayers, saveQuests } = require("./game/gameData")
const { convertConfig } = require("./game/guildConfig")
const { convertPlayers } = require("./game/player")
const { convertQuests } = require("./game/quest")
const guildId = process.argv.slice(2)[0]

if(!guildId) {
    console.log("No guild ID provided!")
    process.exit(1)
}

const oldConfig = loadConfig(guildId)
const oldPlayers = loadPlayers(guildId)
const oldQuests = loadQuests(guildId)

const newConfig = convertConfig(oldConfig)
const newPlayers = convertPlayers(oldPlayers)
const newQuests = convertQuests(oldQuests)

saveConfig(guildId, newConfig)
savePlayers(guildId, newPlayers)
saveQuests(guildId, newQuests)

console.log(`Successfully converted saves for guild ${guildId}`)