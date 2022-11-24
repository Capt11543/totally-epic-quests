const { loadConfig, loadPlayers, loadQuests, saveConfig, savePlayers, saveQuests } = require("./game/gameData")
const { convertConfig } = require("./game/guildConfig")
const { convertPlayers } = require("./game/player")
const { convertQuests } = require("./game/quest")

const guildId = `1004492821253869608`

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