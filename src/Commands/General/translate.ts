import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder } from "discord.js";
import translate from "@iamtraction/google-translate"

export class translateCommand {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
        .setName("translate")
        .setDescription("Translator")
        .addStringOption(option => option.setName("message").setDescription("What do you want me to translate?").setRequired(true))
        .addStringOption(option => option.setName("language").setDescription("The language you want to translate to").addChoices(
            {name: "English", value: "en"},
            {name: "Latin", value: "la"},
            {name: "French", value: "fr"},
            {name: "German", value: "de"},
            {name: "Italian", value: "it"},
            {name: "Portugese", value: "pt"},
            {name: "Spanish", value: "es"},
            {name: "Greek", value: "gl"},
            {name: "Russian", value: "ru"},
            {name: "Japanese", value: "ja"},
            {name: "Arabic", value: "ar"},
        ).setRequired(true))
        .setExecute(async ({interaction, client}) => {
            const {options} = interaction;
            const text = options.getString("message") ?? "";
            const lan = options.getString("language");

            await interaction.reply({content: "Translating your language..."})

            const applied = await translate(text, {to: `${lan}`});

            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("Translate Successful")
            .addFields(
                {name: "Old Text", value: `\`\`\`${text}\`\`\``, inline: false},
                {name: "Translated Text", value: `\`\`\`${applied.text}\`\`\``, inline: false}
            )

            await interaction.editReply({content: "", embeds: [embed]});
    })
];

async onStart() {
  return true;
}
}

export default new translateCommand();