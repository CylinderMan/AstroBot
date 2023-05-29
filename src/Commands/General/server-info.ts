import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder, GuildMember, PermissionFlagsBits, ChannelType, GuildVerificationLevel, GuildExplicitContentFilter, GuildNSFWLevel } from "discord.js";

export class serverinfo {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("server-info")
            .setDescription("Displays information about the server")
            .setExecute(async ({ interaction, client }) => {
                const { guild } = interaction;

                const {
                    members,
                    channels,
                    emojis,
                    roles,
                    stickers
                } = guild ?? {};

                const sortedRoles = roles!.cache.map((role: any) => role).slice(1, roles!.cache.size).sort((a: { position: number; }, b: { position: number; }) => b.position - a.position);
                const userRoles = sortedRoles.filter((role: { managed: any; }) => !role.managed);
                const managedRoles = sortedRoles.filter((role: { managed: any; }) => role.managed);
                const botCount = members!.cache.filter((member: { user: { bot: any; }; }) => member.user.bot).size;

                const maxDisplayRoles = (roles: any, maxFieldLength = 1024) => {
                    let totalLength = 0;
                    const result = [];

                    for (const role of roles) {
                        const roleString = `<@&${role.id}>`;

                        if (roleString.length + totalLength > maxFieldLength)
                            break;

                        totalLength += roleString.length + 1; // +1 as it's likely we want to display them with a space between each role, which counts towards the limit.
                        result.push(roleString);
                    }

                    return result.length;
                }

                const splitPascal = (string: string, separator?: string) => {
                    if (separator) {
                      return string.split(/(?=[A-Z])/).join(separator);
                    }
                    return string;
                  };
                  
                  const toPascalCase = (string: string, separator: string | boolean = false) => {
                    const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match: any, chr: string) => chr.toUpperCase());
                    if (typeof separator === 'boolean' && separator) {
                      return splitPascal(pascal, '-');
                    } else if (typeof separator === 'string') {
                      return splitPascal(pascal, separator);
                    }
                    return pascal;
                  };                  

                const getChannelTypeSize = (type: string | any[]) => channels!.cache.filter((channel: { type: any; }) => type.includes(channel.type)).size;

                const totalChannels = getChannelTypeSize([
                    ChannelType.GuildText,
                    ChannelType.GuildNews,
                    ChannelType.GuildVoice,
                    ChannelType.GuildStageVoice,
                    ChannelType.GuildForum,
                    ChannelType.GuildPublicThread,
                    ChannelType.GuildPrivateThread,
                    ChannelType.GuildNewsThread,
                    ChannelType.GuildCategory
                ]);

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(members!.me!.roles.highest.hexColor)
                            .setTitle(`${guild!.name}'s Information`)
                            .setThumbnail(guild!.iconURL({ size: 1024 }))
                            .setImage(guild!.bannerURL({ size: 1024 }))
                            .addFields(
                                { name: "Description", value: `📝 ${guild!.description || "None"}` },
                                {
                                    name: "General",
                                    value: [
                                        `📜 **Created** <t:${(guild?.createdTimestamp ?? 0 / 1000)}:R>`,
                                        `💳 **ID** ${guild!.id}`,
                                        `👑 **Owner** <@${guild!.ownerId}>`,
                                        `🌍 **Language** ${new Intl.DisplayNames(["en"], { type: "language" }).of(guild!.preferredLocale)}`,
                                        `💻 **Vanity URL** ${guild!.vanityURLCode || "None"}`,
                                    ].join("\n")
                                },
                                { name: "Features", value: guild!.features?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "None", inline: true },
                                {
                                    name: "Security",
                                    value: [
                                        `👀 **Explicit Filter** ${splitPascal(GuildExplicitContentFilter[guild!.explicitContentFilter], " ")}`,
                                        `🔞 **NSFW Level** ${splitPascal(GuildNSFWLevel[guild!.nsfwLevel], " ")}`,
                                        `🔒 **Verification Level** ${splitPascal(GuildVerificationLevel[guild!.verificationLevel], " ")}`
                                    ].join("\n"),
                                    inline: true
                                },
                                {
                                    name: `Users (${guild!.memberCount})`,
                                    value: [
                                        `👨‍👩‍👧‍👦 **Members** ${guild!.memberCount - botCount}`,
                                        `🤖 **Bots** ${botCount}`
                                    ].join("\n"),
                                    inline: true
                                },
                                { name: `User Roles (${maxDisplayRoles(userRoles)} of ${userRoles.length})`, value: `${userRoles.slice(0, maxDisplayRoles(userRoles)).join(" ") || "None"}` },
                                { name: `Managed Roles (${maxDisplayRoles(managedRoles)} of ${managedRoles.length})`, value: `${managedRoles.slice(0, maxDisplayRoles(managedRoles)).join(" ") || "None"}` },
                                {
                                    name: `Channels, Threads & Categories (${totalChannels})`,
                                    value: [
                                        `💬 **Text** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildNews])}`,
                                        `🔊 **Voice** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
                                        `🧵 **Threads** ${getChannelTypeSize([ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildNewsThread])}`,
                                        `📑 **Categories** ${getChannelTypeSize([ChannelType.GuildCategory])}`
                                    ].join("\n"),
                                    inline: true
                                },
                                {
                                    name: `Emojis & Stickers (${emojis!.cache.size + stickers!.cache.size})`,
                                    value: [
                                        `📺 **Animated** ${emojis!.cache.filter((emoji: { animated: any; }) => emoji.animated).size}`,
                                        `🗿 **Static** ${emojis!.cache.filter((emoji: { animated: any; }) => !emoji.animated).size}`,
                                        `🏷 **Stickers** ${stickers!.cache.size}`
                                    ].join("\n"),
                                    inline: true
                                },
                                {
                                    name: "Nitro",
                                    value: [
                                        `📈 **Tier** ${guild!.premiumTier || "None"}`,
                                        `💪🏻 **Boosts** ${guild!.premiumSubscriptionCount}`,
                                        `💎 **Boosters** ${guild!.members.cache.filter(member => member.roles.premiumSubscriberRole).size}`,
                                        `🏋🏻‍♀️ **Total Boosters** ${guild!.members.cache.filter(member => member.premiumSince).size}`
                                    ].join("\n"),
                                    inline: true
                                },
                                { name: "Banner", value: guild!.bannerURL() ? "** **" : "None" }
                            )
                    ], ephemeral: false
                });
            })
    ];

    async onStart() {
        return true;
    }
}

export default new serverinfo();
