import { RecipleClient, RecipleModule, RecipleModuleScript } from "reciple";
import {voteModel} from "../Data/Models/votesSchema.js"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export class InteractionCreate implements RecipleModuleScript {
  public versions: string = "^7";

  public async onStart(client: RecipleClient<false>, module: RecipleModule): Promise<boolean> {
    client.on("interactionCreate", async interaction => {
      if (!interaction.guild) return;
      if (!interaction.isButton()) return;
      if (!interaction.message) return;

      const data = await voteModel.findOne({ Guild: interaction.guild.id, Msg: interaction.message.id });
      if (!data) return;
      const msg = await interaction.channel?.messages.fetch(data.Msg);

      if (interaction.customId === "up") {
          if (data.UpMembers.includes(interaction.user.id)) {
              await interaction.reply({ content: "You cannot vote again! You have already sent an upvote on this poll.", ephemeral: true });
              return;
          }

          let downvotes = data.DownVote;
          if (data.DownMembers.includes(interaction.user.id)) {
              downvotes = downvotes - 1;
              const userIndex = data.DownMembers.indexOf(interaction.user.id);
              if (userIndex > -1) {
                  data.DownMembers.splice(userIndex, 1);
              }
          }

          const newembed = EmbedBuilder.from(msg?.embeds[0] ?? {}).setFields(
              { name: `Upvotes`, value: `> **${data.UpVote + 1}** Votes`, inline: true },
              { name: "Downvotes", value: `> **${downvotes}** Votes`, inline: true },
              { name: "Author", value: `> <@${data.Owner}>`, inline: true }
          );

          const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder().setCustomId("up").setLabel("✅").setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("down").setLabel("❌").setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("votes").setLabel("Votes").setStyle(ButtonStyle.Secondary)
          );

          await interaction.update({ embeds: [newembed], components: [buttons] });

          data.UpVote++;

          if (data.DownMembers.includes(interaction.user.id)) {
              data.DownVote = data.DownVote - 1;
          }

          data.UpMembers.push(interaction.user.id);
          await data.save();
      }

      if (interaction.customId === "down") {
          if (data.DownMembers.includes(interaction.user.id)) {
              await interaction.reply({ content: "You cannot vote again! You have already sent an upvote on this poll.", ephemeral: true });
              return;
          }

          let upvotes = data.UpVote;
          if (data.UpMembers.includes(interaction.user.id)) {
              upvotes = upvotes - 1;
              const userIndex = data.UpMembers.indexOf(interaction.user.id);
              if (userIndex > -1) {
                  data.UpMembers.splice(userIndex, 1);
              }
          }

          const newembed = EmbedBuilder.from(msg?.embeds[0] ?? {}).setFields(
              { name: `Upvotes`, value: `> **${upvotes}** Votes`, inline: true },
              { name: "Downvotes", value: `> **${data.DownVote + 1}** Votes`, inline: true },
              { name: "Author", value: `> <@${data.Owner}>`, inline: true }
          );

          const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder().setCustomId("up").setLabel("✅").setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("down").setLabel("❌").setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId("votes").setLabel("Votes").setStyle(ButtonStyle.Secondary)
          );

          await interaction.update({ embeds: [newembed], components: [buttons] });

          data.DownVote++;

          if (data.UpMembers.includes(interaction.user.id)) {
              data.UpVote = data.UpVote - 1;
              const userIndex = data.UpMembers.indexOf(interaction.user.id);
              if (userIndex > -1) {
                  data.UpMembers.splice(userIndex, 1);
              }
          }

          data.DownMembers.push(interaction.user.id);
          await data.save();
      }

      if (interaction.customId === "votes") {

          let upvoters: string[] = [];
          await data.UpMembers.forEach(async member => {
              upvoters.push(`<@${member}>`)
          });

          let downvoters: string [] = [];
          await data.DownMembers.forEach(async member => {
              downvoters.push(`<@${member}>`)
          });


          const embed = new EmbedBuilder()
              .setColor("Red")
              .setAuthor({ name: "Poll System" })
              .setFooter({ text: "Poll Members" })
              .setTimestamp()
              .setTitle("Poll Votes")
              .addFields(
                  { name: `Upvoters (${upvoters.length})`, value: `> ${upvoters.join(", ").slice(0, 1020) || `No upvoters`}`, inline: true },
                  { name: `Downvoters (${downvoters.length})`, value: `> ${downvoters.join(", ").slice(0, 1020) || `No downvoters`}`, inline: true },
              )

          await interaction.reply({embeds: [embed], ephemeral: true});
      }
  });

    return true;
  }
}

export default new InteractionCreate();