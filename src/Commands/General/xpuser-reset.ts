import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

import { levelModel } from "../../Data/Models/levelSchema.js";

export class xpreset {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("xpuser-reset")
            .setDescription("Reset a member's XP")
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .addUserOption(options => options.setName("user").setDescription("The user whose xp you want to reset").setRequired(true))
            .setExecute(async ({ interaction, client }) => {
               const {guildId} = interaction;

               const target = interaction.options.getUser("user");
               
               levelModel.deleteMany({Guild: guildId, User: target?.id}).then(async (data) => {
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`${target?.tag}'s xp has been reset!`)

                await interaction.reply({embeds: [embed]});
               })
            })
    ];

    async onStart() {
        return true;
    }
}

export default new xpreset();
