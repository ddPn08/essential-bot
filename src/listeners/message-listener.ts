import { ApplyOptions } from '@sapphire/decorators'
import { Events, Listener, ListenerOptions } from '@sapphire/framework'
import { PermissionFlagsBits, type ClientEvents } from 'discord.js'

import { createMessageQuotePayload, getTextMessage, isNsfwTextBasedChannel } from '../utils'

@ApplyOptions<ListenerOptions>({
    event: Events.MessageCreate,
})
export class UserEvent extends Listener {
    public async run(...args: ClientEvents['messageCreate']) {
        const [msg] = args
        const re =
            /https:\/\/(?:www\.)?discord(?:app)?\.com\/channels\/(\d{17,19})\/(\d{17,19})\/(\d{17,19})/gi
        const matches = msg.content.match(re)
        if (!matches) return
        for (const url of matches) {
            const ids = url.split('/').slice(4)
            if (ids.length < 3) return

            const [guildId, channelId, messageId] = ids
            if (!(guildId && channelId && messageId)) return
            const target = await getTextMessage(
                this.container.client,
                guildId,
                channelId,
                messageId,
            )
            if (!target) return

            const channel = await target.channel.fetch()
            if (isNsfwTextBasedChannel(channel) !== isNsfwTextBasedChannel(msg.channel)) return
            if (
                !channel
                    .permissionsFor(target.guild.roles.everyone)
                    ?.has(PermissionFlagsBits.ViewChannel)
            )
                return

            const payload = createMessageQuotePayload(msg, target, true)
            msg.reply(payload)
        }
    }
}
