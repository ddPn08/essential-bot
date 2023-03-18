import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    Client,
    Colors,
    EmbedBuilder,
    Message,
    MessagePayload,
    MessageTarget,
} from 'discord.js'

export const getTextMessage = async (
    client: Client,
    guildId: string,
    channelId: string,
    messageId: string,
) => {
    if (!(guildId && channelId && messageId)) return
    const guild = await client.guilds.fetch(guildId)
    const channel = await guild.channels.fetch(channelId)
    const textChannel = await channel?.fetch()
    if (!textChannel) return
    if (
        !(
            textChannel.type === ChannelType.AnnouncementThread ||
            textChannel.type === ChannelType.GuildAnnouncement ||
            textChannel.type === ChannelType.GuildText ||
            textChannel.type === ChannelType.PublicThread
        )
    )
        return
    return textChannel.messages.fetch(messageId)
}

export const createMessageQuoteEmbed = (message: Message<true>) => {
    const embed = new EmbedBuilder()
        .setColor(Colors.Aqua)
        .setURL(message.url)
        .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL(),
        })
        .setDescription(message.content)
    for (const [, attachment] of message.attachments) {
        if (!attachment.contentType?.startsWith('image/')) continue
        embed.setImage(attachment.url)
        break
    }
    return embed
}

export const createMessageQuotePayload = (
    target: MessageTarget,
    message: Message<true>,
    reply = false,
) =>
    new MessagePayload(target, {
        embeds: [createMessageQuoteEmbed(message)],
        components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setLabel('Jump to message')
                    .setStyle(ButtonStyle.Link)
                    .setURL(message.url),
                new ButtonBuilder()
                    .setLabel('Delete')
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId('delete_message_quote'),
            ),
        ],
        reply: reply ? { messageReference: target as Message } : undefined,
    })
