import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder } from "discord.js";

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_CODE
});
const openai = new OpenAIApi(configuration);

export class chatgpt {
  public versions: string = "^7";

  commands: AnyCommandBuilder[] = [
    new SlashCommandBuilder()
      .setName("chatgpt")
      .setDescription("Ask ChatGPT a question")
      .addStringOption(option => option.setName("question").setDescription("This is the question for ChatGPT").setRequired(true))
      .setExecute(async ({ interaction }) => {
        try {
          await interaction.deferReply();

          const question = interaction.options.getString("question");

          const res = await openai.createCompletion({
            model: "text-davinci-003",
            max_tokens: 2048,
            temperature: 0.5,
            prompt: question
          });

          const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`${question}`)
            .setDescription(`\`\`\`${res.data.choices[0].text}\`\`\``);

          await interaction.editReply({ embeds: [embed] });
        } catch (e) {
          console.error(e);
          await interaction.editReply({ content: "An error occurred while processing your request." });
        }
      })
  ];

  async onStart() {
    return true;
  }
}

export default new chatgpt();
