import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder } from "discord.js";

import axios from "axios";

interface ISSLocation {
    latitude: number;
    longitude: number;
    altitude: number;
    velocity: number;
    visibility: string;
    footprint: number;
    timestamp: number;
    daynum: number;
    solar_lat: number;
    solar_lon: number;
}

async function getNearbyPlace(latitude: number, longitude: number): Promise<string> {
    try {
        const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();

        if (data.locality) {
            const { locality, principalSubdivision, countryName } = data;
            const country = countryName ? ` (${countryName})` : "";
            return `${locality}, ${principalSubdivision}${country}`;
        } else {
            return "Unknown";
        }
    } catch (error) {
        console.error(error);
        return "Unknown";
    }
}

export class iss {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("iss")
            .setDescription("Shows the current location of the International Space Station.")
            .setExecute(async ({ interaction, client }) => {
                try {
                    const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
                    const data: ISSLocation = await response.json();

                    const { latitude, longitude, altitude, visibility, velocity, footprint, timestamp } = data;
                    const date = new Date(timestamp * 1000);

                    const imageUrl = `https://www.mapquestapi.com/staticmap/v5/map?key=lqbAcf7SRMOkJqQqBktVJ4VFTxbNCAis&center=${latitude},${longitude}&zoom=3&size=400,400@2x&locations=${latitude},${longitude}&defaultMarker=marker-icon-red`

                    const embed = new EmbedBuilder()
                        .setTitle("International Space Station")
                        .setColor([51, 66, 174])
                        .setDescription(`The ISS is currently near ${await getNearbyPlace(latitude, longitude)}`)
                        .addFields(
                            { name: "Longitude", value: `${longitude.toFixed(2)}°`, inline: true },
                            { name: "Latitude", value: `${latitude.toFixed(2)}°`, inline: true },
                            { name: "Altitude", value: `${altitude.toFixed(2)} km`, inline: true },
                            { name: "Visibility", value: visibility, inline: true },
                            { name: "Velocity", value: `${velocity.toFixed(2)} km/h`, inline: true },
                            { name: "Footprint", value: `${footprint.toFixed(2)} km`, inline: true },
                            { name: "Timestamp", value: date.toLocaleString(), inline: true }
                        )
                        .setImage(imageUrl);

                    interaction.reply({ embeds: [embed] });
                } catch (error) {
                    console.error(error);
                    interaction.reply("Failed to get ISS location. Please try again later.");
                }
            })
    ];


    async onStart() {
        return true;
    }
}

export default new iss();