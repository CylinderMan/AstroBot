import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { PermissionFlagsBits, EmbedBuilder, GuildMember } from "discord.js";

export class untimeout {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("untimeout")
            .setDescription("Untimeout a member in the server")
            .addUserOption(options => options.setName("user").setDescription("The user who you want to untimeout").setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .setExecute(async ({ interaction, client }) => {

                const timeUser = interaction.options.getUser("user");
                const timeMember = await interaction.guild?.members.fetch(timeUser!.id);
 
                if (!timeMember) await interaction.reply({content: "The user mentioned is no longer in the user"});
                if (!timeMember?.kickable) await interaction.reply({content: "I cannot untime this user!"});
                if (interaction?.member?.user.id === timeMember?.id) await interaction.reply({content: "You cannot untimeout yourself!"});
                if (timeMember?.permissions.has(PermissionFlagsBits.Administrator)) await interaction.reply({content: "You cannot untime someone with admin perms!"});
 
                await timeMember?.timeout(null, "Untimed out");
 
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`${timeUser?.tag}'s timeout has been removed.`)
                
                const dmEmbed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`Your timeout has been removed`)
 
                await timeMember?.send({embeds: [dmEmbed]}).catch(err => {
                 return;
                })
 
                await interaction.reply({embeds: [embed]});
                 
                
            }),
    ];

    async onStart() {
        return true;
    }
}

export default new untimeout();
