import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

export class addEmoji {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("add-emoji")
            .setDescription("Upload emojis to the server")
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .addAttachmentOption(option => option.setName("emoji").setDescription("The emoji that you want to be added to the server").setRequired(true))
            .addStringOption(option => option.setName("name").setDescription("The name of the emoji").setRequired(true))
            .setExecute(async ({ interaction, client }) => {
                const upload = interaction.options.getAttachment("emoji");
                const name = interaction.options.getString("name");

                await interaction.reply({ content: "Loading your emoji.." });
                const emoji = await interaction.guild!.emojis.create({ attachment: `${upload?.url}`, name: `${name}` }).catch(err => {
                    setTimeout(() => {
                        console.log(err);
                        return interaction.editReply({ content: `Something went wrong with adding your emoji. Failed to resize asset below the maximum size: 262144` });
                    }, 2000);
                });

                setTimeout(() => {
                    if (!emoji) return;

                    const embed = new EmbedBuilder()
                        .setColor("Blue")
                        .setDescription(`Your emoji has been added ${emoji}`);

                    interaction.editReply({ content: ``, embeds: [embed] });
                }, 3000);

            })
    ];

    async onStart() {
        return true;
    }
}

export default new addEmoji();
