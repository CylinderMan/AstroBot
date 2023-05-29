import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder } from "discord.js";

import { levelModel } from "../../Data/Models/levelSchema.js";

export class xpleaderboard {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("xp-leaderboard")
            .setDescription("View the server's leaderboard")
            .setExecute(async ({ interaction }) => {
               const {guild, client} = interaction;
               
               let text = "";

               const embed1 = new EmbedBuilder()
               .setColor("Blue")
               .setDescription(`No one is on the leaderboard yet...`)

               const Data = await levelModel.find({Guild: guild?.id})
                    .sort({
                        XP: - 1,
                        Level: -1
                    })
                    .limit(10)

                if (!Data) await interaction.reply({embeds: [embed1]});
                await interaction.deferReply();

                for (let counter = 0; counter < Data.length; ++counter) {
                    let {User, XP, Level} = Data[counter];

                    const value = await client.users.fetch(User) || "Unknown Member";

                    const member = value.tag;

                    text += `${counter + 1}. ${member} | XP: ${XP} | Level: ${Level} \n`

                    const embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle(`${interaction?.guild?.name}'s XP Leaderboard:`)
                    .setDescription(`\`\`\`${text}\`\`\``)
                    .setTimestamp()
                    .setFooter({text: "XP Leaderboard"})

                    interaction.editReply({embeds: [embed]});
                }
            })
    ];

    async onStart() {
        return true;
    }
}

export default new xpleaderboard();
