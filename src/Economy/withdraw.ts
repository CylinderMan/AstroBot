import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder } from "discord.js";
import { ecoModel } from "../../Data/Models/ecoSchema.js";

export class withdraw {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("withdraw")
            .setDescription("Withdraw money")
            .addStringOption(option => option.setName("amount").setDescription("The amount of money that you want to withdraw").setRequired(true))
            .setExecute(async ({ interaction, client }) => {
                const { user, guild, options } = interaction;

                let Data = await ecoModel.findOne({ Guild: interaction.guild?.id, User: interaction.user.id });

                if (!Data) {
                    await interaction.reply({content: "You must have an economy account to use this command!"});
                    return;
                }

                const amount = options.getString("amount");
                if (amount?.startsWith("-")) await interaction.reply({content: "You cannot withdraw a negative amount of money"});

                if (amount?.toLowerCase() === "all") {
                    if (Data.Bank === 0) {
                        await interaction.reply({content: "You have no money to withdraw!"});
                        return;
                    }

                    Data.Wallet += Data.Bank;
                    Data.Bank = 0;

                    await Data.save();

                    await interaction.reply({content: "You have withdrawn all your money from the bank."});
                } else {
                    const Converted = parseInt(String(amount));

                    if (isNaN(Converted) || Converted <= 0) {
                        await interaction.reply({content: "The amount can only be a positive number or 'all'"});
                        return;
                    }

                    if (Data.Bank < Converted || Converted === Infinity) {
                        await interaction.reply({content: "You don't have enough money in the bank to withdraw."});
                        return;
                    }

                    Data.Wallet += Converted;
                    Data.Bank -= Converted;

                    await Data.save();

                    const embed = new EmbedBuilder()
                        .setColor("Blue")
                        .setTitle("Withdraw Success")
                        .setDescription(`Successfully withdrew <:astro_coins:1114237309219512350> ${Converted} from your bank`);

                    await interaction.reply({ embeds: [embed] });
                }
            }),
    ];

    async onStart() {
        return true;
    }
}

export default new withdraw();
