import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder } from "discord.js";

async function fetchNews(): Promise<any> {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }
    return response.json();
  }

export class nasa_news {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
        .setName("news")
        .setDescription("Get the latest news from the NASA news API")
        .setExecute(async ({interaction, client}) => {
            try {
                const data = await fetchNews();
                const embed = new EmbedBuilder()
                  .setColor("#0d6efd")
                  .setTitle(data.title)
                  .setDescription(data.explanation)
                  .setImage(data.url)
                  .setFooter({text: `Published on ${data.date}`})
                interaction.reply({ embeds: [embed] });
              } catch (error) {
                console.error(error);
                interaction.reply("Failed to fetch news from NASA API.");
              }
    })
];


async onStart() {
  return true;
}
}

export default new nasa_news();