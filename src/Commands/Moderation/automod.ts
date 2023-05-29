import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";

export class automod {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("automod")
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .addSubcommand(command => command.setName("flagged-words").setDescription("Block profanity, sexual content and slurs"))
            .addSubcommand(command => command.setName("spam-messages").setDescription("Block messages suspected of spam"))
            .addSubcommand(command => command.setName("mention-spam").setDescription("Block messages containing a certian amount of mentions").addIntegerOption(option => option.setName("number").setDescription("The number of mentions required to block a message").setRequired(true)))
            .addSubcommand(command => command.setName("keyword").setDescription("Block a given keyword in the server").addStringOption(option => option.setName("word").setDescription("The word that you want to block").setRequired(true)))
            .setDescription("Set up rules for the automod")
            .setExecute(async ({ interaction, client }) => {
                const { guild, options } = interaction;
                const sub = options.getSubcommand();

                switch (sub) {
                    case "flagged-words":

                        await interaction.reply({ content: "Loading your automod rule..." })

                        const rule = await guild?.autoModerationRules.create({
                            name: `Block profanity, sexual content and slurs by AstroBot`,
                            enabled: true,
                            eventType: 1,
                            triggerType: 4,
                            triggerMetadata:
                            {
                                presets: [1, 2, 3]
                            },
                            actions: [
                                {
                                    type: 1,
                                    metadata: {
                                        channel: interaction.channel as TextChannel,
                                        durationSeconds: 10,
                                        customMessage: "This message was blocked by AstroBot automoderation"
                                    }
                                }
                            ]
                        }).catch(async err => {
                            setTimeout(async () => {
                                console.log(err);
                                await interaction.editReply({content: `${err}`})
                            }, 2000)
                        })

                    setTimeout(async () => {
                        if (!rule) return;

                        const embed = new EmbedBuilder()
                        .setColor("Blue")
                        .setDescription(`Your automod rule has been created. All swears will be stopped by AstroBot`)

                        await interaction.editReply({content: "", embeds: [embed]});
                    }, 3000)

                    break; 

                    case "keyword":
                        await interaction.reply({ content: "Loading your automod rule..." })
                        const word = options.getString("word");

                        const rule2 = await guild?.autoModerationRules.create({
                            name: `Prevent the ${word} from being used by AstroBot`,
                            enabled: true,
                            eventType: 1,
                            triggerType: 1,
                            triggerMetadata:
                            {
                               keywordFilter: [`${word}`]
                            },
                            actions: [
                                {
                                    type: 1,
                                    metadata: {
                                        channel: interaction.channel as TextChannel,
                                        durationSeconds: 10,
                                        customMessage: "This message was blocked by AstroBot automoderation"
                                    }
                                }
                            ]
                        }).catch(async err => {
                            setTimeout(async () => {
                                console.log(err);
                                await interaction.editReply({content: `${err}`})
                            }, 2000)
                        })

                    setTimeout(async () => {
                        if (!rule2) return;

                        const embed2 = new EmbedBuilder()
                        .setColor("Blue")
                        .setDescription(`Your automod rule has been created. All messages containting the word ${word} will be deleted`)

                        await interaction.editReply({content: "", embeds: [embed2]});
                    }, 3000)

                    break;

                    case "spam-messages":
                        await interaction.reply({ content: "Loading your automod rule..." })

                        const rule3 = await guild?.autoModerationRules.create({
                            name: `Prevent spam messages by AstroBot`,
                            enabled: true,
                            eventType: 1,
                            triggerType: 3,
                            triggerMetadata:
                            {
                               //mentionTotalLimit: number
                            },
                            actions: [
                                {
                                    type: 1,
                                    metadata: {
                                        channel: interaction.channel as TextChannel,
                                        durationSeconds: 10,
                                        customMessage: "This message was blocked by AstroBot automoderation"
                                    }
                                }
                            ]
                        }).catch(async err => {
                            setTimeout(async () => {
                                console.log(err);
                                await interaction.editReply({content: `${err}`})
                            }, 2000)
                        })

                    setTimeout(async () => {
                        if (!rule3) return;

                        const embed3 = new EmbedBuilder()
                        .setColor("Blue")
                        .setDescription(`Your automod rule has been created. All messages suspected of spam will be deleted by AstroBot`)

                        await interaction.editReply({content: "", embeds: [embed3]});
                    }, 3000)

                    break;

                    case "mention-spam":
                        await interaction.reply({ content: "Loading your automod rule..." })
                        const number = options.getInteger("number");

                        const rule4 = await guild?.autoModerationRules.create({
                            name: `Prevent spam mentions`,
                            enabled: true,
                            eventType: 1,
                            triggerType: 5,
                            triggerMetadata:
                            {
                               mentionTotalLimit: number
                            },
                            actions: [
                                {
                                    type: 1,
                                    metadata: {
                                        channel: interaction.channel as TextChannel,
                                        durationSeconds: 10,
                                        customMessage: "This message was blocked by AstroBot automoderation"
                                    }
                                }
                            ]
                        }).catch(async err => {
                            setTimeout(async () => {
                                console.log(err);
                                await interaction.editReply({content: `${err}`})
                            }, 2000)
                        })

                    setTimeout(async () => {
                        if (!rule4) return;

                        const embed4 = new EmbedBuilder()
                        .setColor("Blue")
                        .setDescription(`Your automod rule has been created. All messages suspected of spam mentions will be deleted by AstroBot`)

                        await interaction.editReply({content: "", embeds: [embed4]});
                    }, 3000)

                }
            })
    ];

    async onStart() {
        return true;
    }
}

export default new automod();