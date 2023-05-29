import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { PermissionFlagsBits, EmbedBuilder, GuildMember } from "discord.js";

export class timeout {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("timeout")
            .setDescription("Timeout a member in the server")
            .addUserOption(options => options.setName("user").setDescription("The user who you want to timeout").setRequired(true))
            .addStringOption(options => options.setName("duration").setDescription("The duration of the timeout").setRequired(true).addChoices(
                {name: "60 seconds", value: "60"},
                {name: "2 minutes", value: "120"},
                {name: "5 minutes", value: "300"},
                {name: "10 minutes", value: "900"},
                {name: "20 minutes", value: "1200"},
                {name: "30 minutes", value: "1800"},
                {name: "45 minutes", value: "2700"},
                {name: "1 hour", value: "3600"},
                {name: "2 hours", value: "7200"},
                {name: "3 hours", value: "10000"},
                {name: "5 hours", value: "18000"},
                {name: "10 hours", value: "36000"},
                {name: "1 day", value: "86400"},
                {name: "2 days", value: "172800"},
                {name: "3 days", value: "259200"},
                {name: "5 days", value: "432000"},
                {name: "One week", value: "604800"},
            ))
            .addStringOption(option => option.setName("reason").setDescription("Reason for the timeout").setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .setExecute(async ({ interaction, client }) => {

               const timeUser = interaction.options.getUser("user");
               const timeMember = await interaction.guild?.members.fetch(timeUser!.id);
               const duration = parseInt(interaction.options.getString("duration") || "0", 10);
               const reason = interaction.options.getString("reason") || "No reason";

               if (!timeMember) await interaction.reply({content: "The user mentioned is no longer in the user"});
               if (!timeMember?.kickable) await interaction.reply({content: "I cannot timeout this user!"});
               if (interaction?.member?.user.id === timeMember?.id) await interaction.reply({content: "You cannot timeout yourself!"});
               if (timeMember?.permissions.has(PermissionFlagsBits.Administrator)) await interaction.reply({content: "You cannot timeout someone with admin perms!"});

               await timeMember?.timeout(duration * 1000, reason);

               const embed = new EmbedBuilder()
               .setColor("Blue")
               .setDescription(`${timeUser?.tag} has been timed out for ${duration / 60} minute(s) | ${reason}`)
               
               const dmEmbed = new EmbedBuilder()
               .setColor("Blue")
               .setDescription(`You have been timed out in AstroHub. You can check your timeout within the server | ${reason}`)

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

export default new timeout();
