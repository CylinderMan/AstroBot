import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder } from "discord.js";
import { ecoModel } from "../../Data/Models/ecoSchema.js";

export class deposit {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("deposit")
            .setDescription("Deposit money")
            .addStringOption(option => option.setName("amount").setDescription("The amount of money that you want to deposit").setRequired(true))
            .setExecute(async ({ interaction, client }) => {
                const { user, guild, options } = interaction;

                let Data = await ecoModel.findOne({ Guild: interaction.guild?.id, User: interaction.user.id });

                if (!Data) {
                    await interaction.reply({content: "You must have an economy account to use this command!"});
                    return;
                }

                const amount = options.getString("amount");
                if (amount?.startsWith("-")) await interaction.reply({content: "You cannot deposit a negative amount of money"});

                if (amount?.toLowerCase() === "all") {
                    if (Data.Wallet === 0) {
                        await interaction.reply("You have no money to deposit!");
                        return;
                    }

                    Data.Bank += Data.Wallet;
                    Data.Wallet = 0;

                    await Data.save();

                    await interaction.reply({content: "All your money has been deposited"});
                } else {
                    const Converted = parseInt(String(amount));

                    if (isNaN(Converted) || Converted <= 0) {
                        await interaction.reply({content: "The amount can only be a positive number or 'all'"});
                        return;
                    }

                    if (Data.Wallet < Converted || Converted === Infinity) {
                        await interaction.reply({content: "You don't have enough money to deposit."});
                        return;
                    }

                    Data.Bank += Converted;
                    Data.Wallet -= Converted;

                    await Data.save();

                    const embed = new EmbedBuilder()
                        .setColor("Blue")
                        .setTitle("Deposit Success")
                        .setDescription(`Successfully deposited <:astro_coins:1114237309219512350> ${Converted} into your bank`);

                    await interaction.reply({ embeds: [embed] });
                }
            }),
    ];

    async onStart() {
        return true;
    }
}

export default new deposit();
