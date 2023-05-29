import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { PermissionFlagsBits, EmbedBuilder } from "discord.js";

export class unban {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("unban")
            .setDescription("Unban a user in the server")
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .addStringOption(options => options.setName("user-id").setDescription("The id of the user of who you want to unban").setRequired(true))
            .setExecute(async ({ interaction, client }) => {
                const { channel, options } = interaction;

                const userId = options.getString("user-id") as string;

                try {
                    await interaction.guild!.members.unban(userId);

                    const embed = new EmbedBuilder()
                    .setDescription(`Successfully unbanned id ${userId} from the guild`)
                    .setColor("Blue")
                    .setTimestamp()

                    await interaction.reply({embeds: [embed]});
                } catch (error) {
                    console.log(error);

                    const errorEmbed = new EmbedBuilder()
                    .setDescription("Please provide a valid member's user id")
                    .setColor("Red")

                    interaction.reply({embeds: [errorEmbed]});
                }
            }),
    ];

    async onStart() {
        return true;
    }
}

export default new unban();
