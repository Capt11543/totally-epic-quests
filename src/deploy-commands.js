const fs = require(`fs`)
const path = require(`path`)
const { Routes } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { clientId, token } = require('./config.json')

const guildId = process.argv.slice(2)[0]
if(!guildId) {
    console.log("No guild ID provided!")
    process.exit(1)
}

const commands = []
const commandsPath = path.join(__dirname, `commands`)
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(`.js`))

for(const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    commands.push(command.data.toJSON())
}

const rest = new REST({ version: '10' }).setToken(token)

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log(`Successfully registered application commands for guild ${guildId}`))
	.catch(console.error)