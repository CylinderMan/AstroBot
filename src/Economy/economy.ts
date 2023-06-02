import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, NewsChannel, PrivateThreadChannel, PublicThreadChannel, TextChannel } from "discord.js";
import { ecoModel } from "../../Data/Models/ecoSchema.js";

export class economy {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("economy")
            .setDescription("Create your economy account")
            .setExecute(async ({ interaction, client }) => {
                const { user, guild } = interaction;

                let Data = await ecoModel.findOne({ Guild: interaction.guild?.id, User: interaction.user.id });

                const embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle("Account")
                    .setDescription(`Choose your option`)
                    .addFields({ name: "Create", value: "Create your account" })
                    .addFields({ name: "Delete", value: "Delete your account" });

                const embed2 = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle("Created your account")
                    .setDescription(`Account has been created`)
                    .addFields({ name: "Success", value: `Your account has been successfully created. You have got <:astro_coins:1114237309219512350> 1000 AstroCoins upon creating your account` })
                    .setFooter({ text: `Requested by ${interaction.user.username}` })
                    .setTimestamp();

                const embed3 = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle("Deleted your account")
                    .setDescription(`Your account has been deleted`)
                    .addFields({ name: "Success", value: `Your economy account has been deleted` })
                    .setFooter({ text: `Requested by ${interaction.user.username}` })
                    .setTimestamp();

                const button = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("page1")
                            .setEmoji("✅")
                            .setLabel("Create")
                            .setStyle(ButtonStyle.Success),

                        new ButtonBuilder()
                            .setCustomId("page2")
                            .setEmoji("❌")
                            .setLabel("Delete")
                            .setStyle(ButtonStyle.Danger),
                    );

                const message = await interaction.reply({ embeds: [embed], components: [button] });

                const textChannel = message as unknown as TextChannel | PrivateThreadChannel | PublicThreadChannel<boolean> | NewsChannel;
                const collector = textChannel.createMessageComponentCollector();

                collector.on("collect", async (i) => {
                    if (i.customId === "page1") {
                        if (i.user.id !== interaction.user.id) {
                            await i.reply({ content: `Only ${interaction.user.tag} can use this button`, ephemeral: true });
                        }

                        Data = new ecoModel({
                            Guild: interaction.guild?.id,
                            User: user.id,
                            Bank: 0,
                            Wallet: 1000,
                        });

                        await Data.save();

                        await i.update({ embeds: [embed2], components: [] });
                    }

                    if (i.customId === "page2") {
                        if (i.user.id !== interaction.user.id) {
                            await i.reply({ content: `Only ${interaction.user.tag} can use this button`, ephemeral: true });
                        }

                        await ecoModel.deleteMany({ Guild: interaction.guild?.id, User: user.id });

                        await i.update({ embeds: [embed3], components: [] });
                    }
                });
            }),
    ];

    async onStart() {
        return true;
    }
}

export default new economy();
