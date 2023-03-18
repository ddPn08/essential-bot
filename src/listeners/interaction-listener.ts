import { ApplyOptions } from '@sapphire/decorators'
import { Events, Listener, ListenerOptions } from '@sapphire/framework'
import { ClientEvents, InteractionType } from 'discord.js'

import { getTextMessage } from '../utils'

@ApplyOptions<ListenerOptions>({
    event: Events.InteractionCreate,
})
export class UserEvent extends Listener {
    public async run(...args: ClientEvents['interactionCreate']) {
        const [interaction] = args

        if (interaction.type !== InteractionType.MessageComponent) return
        if (interaction.customId !== 'delete_message_quote') return
        if (!interaction.message.inGuild()) {
            await interaction.message.delete()
            return
        }
        if (!interaction.message.reference) return

        const ref = interaction.message.reference
        if (!(ref.guildId && ref.channelId && ref.messageId)) return
        const refMessage = await getTextMessage(
            this.container.client,
            ref.guildId,
            ref.channelId,
            ref.messageId,
        )

        if (interaction.user.id !== refMessage?.author.id) {
            interaction.reply({
                ephemeral: true,
                content: 'メッセージの引用を削除できるのは、引用したユーザーのみです。',
            })
            return
        }
        await interaction.message.delete()
    }
}
