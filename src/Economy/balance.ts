import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder } from "discord.js";
import { ecoModel } from "../../Data/Models/ecoSchema.js";

export class balance {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("balance")
            .setDescription("Check your economy account")
            .setExecute(async ({ interaction, client }) => {
                const { user, guild } = interaction;

                let Data = await ecoModel.findOne({ Guild: interaction.guild?.id, User: user.id });

                if (!Data) {
                    await interaction.reply({ content: "You must have an economy account to use this command!" });
                    return;
                }

                const wallet = Math.round(Data.Wallet || 0); 
                const bank = Math.round(Data.Bank);
                const total = Math.round(Data.Wallet + Data.Bank)

                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Account Balance")
                .addFields({name: `Balance`, value: `**Bank:** <:astro_coins:1114237309219512350> ${bank}\n**Wallet:** <:astro_coins:1114237309219512350> ${wallet}\n**Total:** <:astro_coins:1114237309219512350> ${total}`})

                await interaction.reply({embeds: [embed]});
               
            }),
    ];

    async onStart() {
        return true;
    }
}

export default new balance();
