import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";
import { stickyModel } from "../../Data/Models/stickySchema.js";

export class unstick {
  public versions: string = "^7";
  commands: AnyCommandBuilder[] = [
    new SlashCommandBuilder()
      .setName("unstick")
      .setDescription("Unstick a sticky message in the current channel")
      //.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .setDMPermission(false)
      .setExecute(async ({ interaction, client }) => {
        const data = await stickyModel.findOne({ ChannelID: interaction.channel?.id });

        if (!data) {
          await interaction.reply({ content: "There is no sticky message in this channel" });
        } else {
          try {
            const channel = interaction.client.channels.cache.get(data.ChannelID) as TextChannel;
            if (!channel) return;
            const m = await channel.messages.fetch(data.LastMessageID);
            
            await m.delete();
          } catch (e) {
            console.log(e);
          }
        }

        stickyModel.deleteMany({ChannelID: interaction.channel?.id}).then(async data => {
            return await interaction.reply({content: "The sticky message in this channel has been deleted"})
        })
      }),
  ];

  async onStart() {
    return true;
  }
}

export default new unstick();
