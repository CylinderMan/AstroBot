import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder } from "discord.js";
import { ecoModel } from "../../Data/Models/ecoSchema.js";

var timeout: any = []

export class rob {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("rob")
            .setDescription("Attempt to rob someone")
            .addUserOption(option => option.setName("user").setDescription("The user you want to rob").setRequired(true))
            .setExecute(async ({ interaction, client }) => {
                const { user, guild, options } = interaction;

                let Data = await ecoModel.findOne({ Guild: interaction.guild?.id, User: interaction.user.id });

                if (!Data) {
                    await interaction.reply({ content: "You must have an economy account to use this command!" });
                    return;
                }

                if (timeout.includes(interaction.user.id)) await interaction.reply({ content: "Wait for 5 minutes before attempting to rob someone again" });

                const userStealing = options.getUser("user");

                let DataUser = await ecoModel.findOne({ Guild: interaction.guild?.id, User: userStealing?.id });

                if (userStealing === interaction.user) await interaction.reply({ content: "You cannot rob yourself!" });

                if (!DataUser) await interaction.reply({ content: "That user does not have an economy account!" });

                if (DataUser?.Wallet === undefined || DataUser.Wallet <= 0) {
                    await interaction.reply({ content: "This user does not have anything in their wallet." });
                    return;
                };

                let negative = Math.round((Math.random() * 150) - 10);
                let positive = Math.round((Math.random() * 300) + 10);

                const posN = [negative, positive];

                const amount = Math.round(Math.random() * posN.length);
                const value = posN[amount];

                if (Data.Wallet <= 0) await interaction.reply({ content: "You cannot rob this user because your user has 0 AstroCoins in it!" });

                if (value > 0) {

                    const positiveChoices = [
                        "You stole",
                        "The owner saw you and let you rob",
                        "You robbed",
                        "You took",
                        "You hacked into AstroHub and stole",
                        "You did nothing but still managed to steal",
                        "You and your friend robbed",
                    ]

                    const posName = Math.floor(Math.random() * positiveChoices.length);

                    const begEmbed = new EmbedBuilder()
                        .setColor("Blue")
                        .setTitle("Robbery Success")
                        .addFields(
                            { name: "You robbed and", value: `${positiveChoices[posName]} <:astro_coins:1114237309219512350> ${value} AstroCoins` }
                        )

                    await interaction.reply({ embeds: [begEmbed] });

                    Data.Wallet += value;
                    await Data.save();

                    DataUser.Wallet -= value;
                    await DataUser.save();
                } else if (value < 0) {

                    const negativeChoices = [
                        "LOL YOU GOT CAUGHT AND LOST",
                        "You lost",
                        "You did nothing but still lost",
                        "You tripped over and lost",
                        "You forgot your ID and you lost",
                        "Someone spotted you and you lost",
                        "You admitted to robbing and lost"
                    ]

                    const val = Data.Wallet;
                    if (isNaN(value)) await interaction.reply({ content: "The user called the cops but you managed to get away. Lucky!" });

                    const negName = Math.floor(Math.random() * negativeChoices.length);

                    let nonSymbol;
                    if (value - val < 0) {
                        const stringV = `${value}`;

                        nonSymbol = await stringV.slice(1);

                        const los = new EmbedBuilder()
                            .setColor("Red")
                            .setTitle("Robbery Failed")
                            .addFields(
                                { name: "You robbed and", value: `${negativeChoices[negName]} <:astro_coins:1114237309219512350> ${nonSymbol} AstroCoins` }
                            )

                        Data.Bank += value;
                        await Data.save();

                        DataUser.Wallet -= value;
                        await DataUser.save();

                        await interaction.reply({embeds: [los]});
                    }

                    const begLostEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("Robbery Failed")
                    .addFields(
                        { name: "You robbed and", value: `${negativeChoices[negName]} <:astro_coins:1114237309219512350> ${nonSymbol} AstroCoins` }
                    )

                    await interaction.reply({embeds: [begLostEmbed]});
                    
                    Data.Wallet += value;
                    await Data.save();

                    DataUser.Wallet -= value;
                    await DataUser.save();

                }

                timeout.push(interaction.user.id);
                setTimeout(() => {
                    timeout.shift();
                }, 300000)

            }),
    ];

    async onStart() {
        return true;
    }
}

export default new rob();
