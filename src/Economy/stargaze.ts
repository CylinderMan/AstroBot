import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder } from "discord.js";
import { ecoModel } from "../../Data/Models/ecoSchema.js";

export class stargaze {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("stargaze")
            .setDescription("Explore the cosmos and collect AstroCoins")
            .setExecute(async ({ interaction, client }) => {
                const { user, guild } = interaction;

                let Data = await ecoModel.findOne({ Guild: interaction.guild?.id, User: interaction.user.id });
                
                if(!Data) await interaction.reply({content: "You must have an economy account to use this command!"});

                // Check if the user has already collected AstroCoins recently
                if (Data?.lastStargaze) {
                    const timeSinceLastStargaze = Date.now() - Data.lastStargaze.getTime();
                    const cooldown = 60 * 60 * 1000; // 1 hour cooldown

                    if (timeSinceLastStargaze < cooldown) {
                        const remainingTime = cooldown - timeSinceLastStargaze;
                        const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));

                        const embed = new EmbedBuilder()
                            .setColor("Blue")
                            .setDescription(`You need to wait ${remainingMinutes} minutes before stargazing again.`);

                        await interaction.reply({ embeds: [embed], ephemeral: true });
                        return;
                    }
                }

                // Generate AstroCoins reward between 100 and 500
                const reward = Math.floor(Math.random() * 401) + 100;

                // Update the user's AstroCoins balance
                if (Data) {
                    Data.Wallet += reward;
                    Data.lastStargaze = new Date();
                } else {
                    Data = new ecoModel({
                        Guild: interaction.guild?.id,
                        User: user.id,
                        Bank: 0,
                        Wallet: reward,
                        lastStargaze: new Date(),
                    });
                }

                await Data.save();

                const embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle("Stargaze Successful")
                    .setDescription(`You explored the cosmos and found ${reward} <:astro_coins:1114237309219512350> AstroCoins!`);

                await interaction.reply({ embeds: [embed] });
            }),
    ];

    async onStart() {
        return true;
    }
}

export default new stargaze();
