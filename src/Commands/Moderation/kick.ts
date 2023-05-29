import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { PermissionFlagsBits, EmbedBuilder, GuildMemberRoleManager } from "discord.js";

export class kick {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("kick")
            .setDescription("Kick a user in the server")
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .addUserOption(options => options.setName("user").setDescription("The user who you want to kick").setRequired(true))
            .addStringOption(options => options.setName("reason").setDescription("The reason for kicking").setRequired(false))
            .setExecute(async ({ interaction, client }) => {
                const { channel, options } = interaction;

                const user = options.getUser("user");
                const reason = options.getString("reason") || "No reason" as string;

                const member = await interaction.guild?.members.fetch(user!.id);

                const errEmbed = new EmbedBuilder()
                .setDescription(`You can't take action on ${user?.username} since they have a higher role than you.`)
                .setColor("Red")

                const dmEmbed = new EmbedBuilder()
                .setDescription(`You have been kicked from AstroHub with reason: ${reason}`)
                .setColor("Blue")

                const memberHighestRole = member?.roles.highest;
                const interactionMemberRoles = interaction.member?.roles;

                if (memberHighestRole && interactionMemberRoles && interactionMemberRoles instanceof GuildMemberRoleManager) {
                    const interactionMemberHighestRole = interactionMemberRoles.highest;
                    if (memberHighestRole.position >= interactionMemberHighestRole?.position) {
                        await interaction.reply({ embeds: [errEmbed] });
                    }
                }

                await member?.send({embeds: [dmEmbed]}).catch(err => { return; });
                await member?.kick(reason)

                const successEmbed = new EmbedBuilder()
                .setDescription(`Successfully kicked ${user} with reason: ${reason} `)
                .setColor("Blue")

                await interaction.reply({embeds: [successEmbed]});
            }),
    ];

    async onStart() {
        return true;
    }
}

export default new kick();
