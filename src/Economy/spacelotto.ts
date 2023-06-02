import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { ecoModel } from "../../Data/Models/ecoSchema.js";

const COOLDOWN_DURATION = 3600; // Cooldown duration in seconds (1 hour)

export class spaceLotto {
    public versions: string = "^7";

    // Create a map to store the last command usage timestamps
    cooldowns: Map<string, number> = new Map();

    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("spacelotto")
            .setDescription("Participate in the space lottery")
            .setExecute(async ({ interaction, client }) => {
                const { user, guild } = interaction;

                // Check if the user is on cooldown
                const lastUsage = this.cooldowns.get(user.id);
                if (lastUsage && Date.now() - lastUsage < COOLDOWN_DURATION * 1000) {
                    const remainingTime = Math.ceil((COOLDOWN_DURATION * 1000 - (Date.now() - lastUsage)) / 1000);
                    await interaction.reply(`You are on cooldown. Please try again in ${remainingTime} seconds.`);
                    return;
                }

                let userData = await ecoModel.findOne({ Guild: interaction.guild?.id, User: interaction.user.id });

                if (!userData) {
                    await interaction.reply("You must have an economy account to use this command!");
                    return;
                }

                const ticketPrice = 100; // The price per lottery ticket

                // Check if the user has enough balance to buy a ticket
                if (userData.Wallet < ticketPrice) {
                    await interaction.reply("You don't have enough AstroCoins to buy a lottery ticket.");
                    return;
                }

                // Deduct the ticket price from the user's wallet
                userData.Wallet -= ticketPrice;
                await userData.save();

                // Generate a random lottery number
                const winningNumber = Math.floor(Math.random() * 100) + 1;

                // Generate the user's chosen number
                const userNumber = Math.floor(Math.random() * 100) + 1;

                // Check if the user's number matches the winning number
                const isWinner = userNumber === winningNumber;

                // Define the prize amount
                const prizeAmount = 500;

                if (isWinner) {
                    // Add the prize amount to the user's wallet
                    userData.Wallet += prizeAmount;
                    await userData.save();

                    await interaction.reply(
                        `Congratulations! Your number (${userNumber}) matches the winning number (${winningNumber}). You won <:astro_coins:1114237309219512350> ${prizeAmount} AstroCoins!`
                    );
                } else {
                    await interaction.reply(
                        `Better luck next time! Your number (${userNumber}) did not match the winning number (${winningNumber}).`
                    );
                }

                // Set the command usage timestamp in the cooldown map
                this.cooldowns.set(user.id, Date.now());
            }),
    ];

    async onStart() {
        return true;
    }
}

export default new spaceLotto();
