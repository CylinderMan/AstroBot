import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder, PermissionFlagsBits, Role } from "discord.js";

export class RoleAll {
  public versions: string = "^7";
  commands: AnyCommandBuilder[] = [
    new SlashCommandBuilder()
      .setName("role-all")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
      .setDescription("Give a role to everyone in the server")
      .addRoleOption(option => option.setName("role").setDescription("The role that you want to give to everyone").setRequired(true))
      .setExecute(async ({ interaction, client }) => {
        const { options, guild } = interaction;
        const members = await guild?.members.fetch();
        const role = options.getRole("role") as Role;

        if (!members) {
          await interaction.reply({ content: "Unable to fetch member list." });
          return;
        }

        await interaction.reply({ content: `Giving everyone the ${role.name}... this may take some time.` });

        let num = 0;
        setTimeout(async () => {
          for (const [, member] of members) {
            await member.roles.add(role).catch(err => {
                return;
            });
            num++;
          }

          const embed = new EmbedBuilder()
          .setColor("Blue")
          .setDescription(`${num} members now have the ${role.name} role.`)

          await interaction.editReply({content: "", embeds: [embed]});
        }, 100);
      })
  ];

  async onStart() {
    return true;
  }
}

export default new RoleAll();
