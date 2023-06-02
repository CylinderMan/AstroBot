import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { ecoModel } from "../../Data/Models/ecoSchema.js";
import { Collection, Snowflake } from "discord.js";

// Define a collection to store cooldowns
const cooldowns: Collection<Snowflake, number> = new Collection();

export class moonMining {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("moonmining")
            .setDescription("Engage in moon mining activities")
            .setExecute(async ({ interaction, client }) => {
                const { user, guild } = interaction;

                let userData = await ecoModel.findOne({ Guild: interaction.guild?.id, User: interaction.user.id });

                // Check if the user is on cooldown
                if (cooldowns.has(user.id)) {
                    await interaction.reply("You're on cooldown. Please wait before mining again.");
                    return;
                }

                if (!userData) {
                    await interaction.reply("You must have an economy account to use this command!");
                    return;
                }

                // Set the success rate (e.g., 70% success rate)
                const successRate = 0.7;

                // Check if the mining attempt is successful
                const isSuccessful = Math.random() < successRate;

                // Calculate the amount of AstroCoins earned based on the success rate
                const minedAstroCoins = isSuccessful ? Math.floor(Math.random() * 100) + 1 : 0;

                // Update the user's wallet balance
                userData.Wallet += minedAstroCoins;
                await userData.save();

                if (isSuccessful) {
                    await interaction.reply(`You went moon mining and found <:astro_coins:1114237309219512350> ${minedAstroCoins} AstroCoins!`);
                } else {
                    await interaction.reply("You went moon mining but didn't find any AstroCoins. Better luck next time!");
                }

                // Apply cooldown to the user
                cooldowns.set(user.id, Date.now());

                // Set the cooldown duration (e.g., 1 hour)
                const cooldownDuration = 60 * 60 * 1000; // 1 hour in milliseconds

                // Remove the cooldown after the specified duration
                setTimeout(() => {
                    cooldowns.delete(user.id);
                }, cooldownDuration);
            }),
    ];

    async onStart() {
        return true;
    }
}

export default new moonMining();
