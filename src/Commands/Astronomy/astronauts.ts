import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder } from "discord.js";

import axios from "axios";

interface Astronaut {
    craft: string;
    name: string;
}

export class astronauts {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("astronauts")
            .setDescription("Displays the current number of people in space and their names.")
            .setExecute(async ({ interaction, client }) => {
                try {
                    const response = await fetch('http://api.open-notify.org/astros.json');
                    const data = await response.json();

                    const astronautCount = data.number;
                    const astronauts = data.people as Astronaut[];

                    const embed = new EmbedBuilder()
                        .setTitle(`Current Astronauts in Space`)
                        .setDescription(`There are currently ${astronautCount} astronauts in space:`)
                        .setColor('#3342AE');

                    astronauts.forEach((astronaut) => {
                        embed.addFields({ name: `${astronaut.name}`, value: `${astronaut.craft}`, inline: true });
                    });

                    interaction.reply({ embeds: [embed] });
                } catch (error) {
                    console.error(error);
                    interaction.reply('Failed to get astronaut data :(');
                }
            })
    ];


    async onStart() {
        return true;
    }
}

export default new astronauts();