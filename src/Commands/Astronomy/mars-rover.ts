import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder } from "discord.js";

import axios from "axios";
const MARS_ROVER_API_KEY = process.env.NASA_API_KEY;

export class mars_rover {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
        .setName("mars-rover")
        .setDescription("Displays the latest photo taken by the Mars Rover")
        .setExecute(async ({interaction, client}) => {
            try {
                const response = await axios.get(
                  `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${MARS_ROVER_API_KEY}`
                );
          
                const { img_src, earth_date, rover } = response.data.latest_photos[0];
          
                const embed = new EmbedBuilder()
                .setTitle(`Latest Photo from the ${rover.name} Rover on Mars`)
                .setColor("DarkRed")
                .setImage(img_src)
                .setDescription(`Taken on ${earth_date}`)
                .setFooter({text: "Provided by NASA's Mars Rover API"});
          
                await interaction.reply({ embeds: [embed] });
              } catch (error) {
                console.error(error);
                await interaction.reply("An error occurred while fetching the photo :(");
              }
    })
];


async onStart() {
  return true;
}
}

export default new mars_rover();