import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder, AttachmentBuilder, GuildMember } from "discord.js";
import { levelModel } from "../../Data/Models/levelSchema.js";
import Canvacord from "canvacord";

export class rank {
  public versions: string = "^7";

  commands: AnyCommandBuilder[] = [
    new SlashCommandBuilder()
      .setName("rank")
      .setDescription("Get a member's rank in the server")
      .addUserOption((options) =>
        options.setName("user").setDescription("The user whose rank you want to check").setRequired(false)
      )
      .setExecute(async ({ interaction }) => {
        const { options, guild, user } = interaction;
        const Member = options.getUser("user") || user;
        const member = guild?.members.cache.get(Member.id);
        const Data = await levelModel.findOne({ Guild: guild?.id, User: member!.id });

        const embed = new EmbedBuilder().setColor("Blue").setDescription(`${member} has not gained any XP yet`);

        if (!Data) {
          await interaction.reply({ embeds: [embed] });
        }

        await interaction.deferReply();

        const Required = Data!.Level * Data!.Level * 20 + 20;
        const avatarURL = member?.displayAvatarURL({ forceStatic: true }) ?? "";

        const rank = new Canvacord.Rank()
          .setAvatar(avatarURL)
          .setBackground("IMAGE", "https://media.discordapp.net/attachments/1109151806661074954/1111665138488066188/photo-1465101162946-4377e57745c3.png?width=935&height=618")
          .setCurrentXP(Data!.XP)
          .setRequiredXP(Required)
          .setRank(1, "Rank", false)
          .setLevel(Data!.Level, "Level")
          .setUsername(member!.user.username)
          .setDiscriminator(member!.user.discriminator);

        const Card = await rank.build();

        const attachment = new AttachmentBuilder(Card, { name: "rank.png" });

        const embed2 = new EmbedBuilder()
          .setColor("Blue")
          .setTitle(`${member?.user.username}'s Level / Rank`)
          .setImage("attachment://rank.png");

        await interaction.editReply({ embeds: [embed2], files: [attachment] });
      })
  ];

  async onStart() {
    return true;
  }
}

export default new rank();
