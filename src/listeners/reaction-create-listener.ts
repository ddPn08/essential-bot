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
            const user = await author.fetch()
            const payload = createMessageQuotePayload(user, reaction.message)
            author.send(payload)
        }
    }
}
