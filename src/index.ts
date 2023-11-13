import '@sapphire/plugin-hmr/register'
import { SapphireClient } from '@sapphire/framework'
import { GatewayIntentBits, Partials } from 'discord.js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()
export const isDev = process.env['NODE_ENV'] === 'development'

const client = new SapphireClient({
    disableMentionPrefix: true,
    loadMessageCommandListeners: true,
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Message, Partials.Reaction],
    
})

client.stores.forEach((store, key) => {
    store.registerPath(path.join(__dirname, key))
})
client.login(process.env['DISCORD_BOT_TOKEN'])
