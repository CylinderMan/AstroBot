import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

import { levelModel } from "../../Data/Models/levelSchema.js";

export class xpallreset {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("xp-reset")
            .setDescription("Reset ALL of the server's XP levels")
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .setExecute(async ({ interaction, client }) => {
               const {guildId} = interaction;
               
               levelModel.deleteMany({Guild: guildId}).then(async (data) => {
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`The XP system in this server has been reset`)

                await interaction.reply({embeds: [embed]});
               })
            })
    ];

    async onStart() {
        return true;
    }
}

export default new xpallreset();
