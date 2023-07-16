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
    TextBasedChannel,
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

export const createMessageQuoteEmbeds = (message: Message<true>) => {
    const embed = new EmbedBuilder().setColor(Colors.Aqua).setURL(message.url).setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
    })
    if (message.content) embed.setDescription(message.content)
    const images = []
    for (const [, attachment] of message.attachments) {
        if (!attachment.contentType?.startsWith('image/')) continue
        images.push(new EmbedBuilder().setURL(message.url).setImage(attachment.url))
    }
    return [embed, ...images]
}

export const createMessageQuotePayload = (
    target: MessageTarget,
    message: Message<true>,
    reply = false,
) =>
    new MessagePayload(target, {
        embeds: createMessageQuoteEmbeds(message),
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

export const isNsfwTextBasedChannel = (channel: TextBasedChannel) => {
    return (
        (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) &&
        channel.nsfw
    )
}
