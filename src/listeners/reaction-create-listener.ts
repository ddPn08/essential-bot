import { ApplyOptions } from '@sapphire/decorators'
import { Events, Listener, ListenerOptions } from '@sapphire/framework'
import type { ClientEvents } from 'discord.js'

import { createMessageQuotePayload } from '../utils'

@ApplyOptions<ListenerOptions>({
    event: Events.MessageReactionAdd,
})
export class UserEvent extends Listener {
    public async run(...args: ClientEvents['messageReactionAdd']) {
        const [reaction, author] = args
        if (reaction.message.inGuild()) {
            if (reaction.emoji.id !== '681856036281647167') return
            const user = await author.fetch()
            const message = await reaction.message.fetch()
            const payload = createMessageQuotePayload(user, message)
            author.send(payload)
        }
    }
}
