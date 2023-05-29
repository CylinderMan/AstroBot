import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder } from "discord.js";

const facts = [
    "A year on Mercury is just 88 days long.",
    "Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.",
    "Saturn's rings are mostly composed of ice particles with a smaller amount of rocky debris and dust.",
    "The Moon is not a perfect sphere; it is slightly flattened at the poles and bulges at the equator.",
    "The tallest mountain in the solar system is Olympus Mons, located on Mars. It is three times taller than Mount Everest.",
    "The first living being sent into space was a dog named Laika in 1957.",
    "The Milky Way galaxy is estimated to contain at least 100 billion planets.",
    "There are more possible iterations of a game of chess than there are atoms in the known universe.",
    "The universe is estimated to be around 13.8 billion years old.",
    "The closest star to our solar system is Proxima Centauri, which is about 4.24 light-years away.",
    "The Milky Way, our galaxy, is estimated to have between 100 and 400 billion stars.",
    "The most abundant element in the universe is hydrogen.",
    "There are more stars in the universe than there are grains of sand on all the beaches on Earth.",
    "The largest known star, UY Scuti, has a radius over 1,700 times that of the sun.",
    "The sun is a main-sequence star, meaning it is in the middle of its life cycle.",
    "The first living beings sent into space were fruit flies, in 1947.",
    "Venus is the hottest planet in our solar system, with surface temperatures that can reach 864 degrees Fahrenheit (462 degrees Celsius).",
    "Jupiter is the largest planet in our solar system, with a diameter of approximately 86,881 miles (139,822 kilometers).",
    "The first satellite to orbit Earth was Sputnik 1, launched by the Soviet Union on October 4, 1957.",
    "The Hubble Space Telescope has captured over a million images since it was launched in 1990.",
    "The first human to travel into space was Yuri Gagarin, who orbited Earth on April 12, 1961.",
    "The Kuiper Belt, beyond Neptune, is home to many icy objects including Pluto.",
    "There are eight planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.",
    "A day on Venus is longer than a year on Venus.",
    "A single day on Jupiter is only about 10 hours long.",
    "Black holes are objects with such strong gravitational pull that nothing, not even light, can escape once it gets too close.",
    "The asteroid belt is a region of space between Mars and Jupiter where many asteroids are found.",
    "The moon is the fifth largest moon in our solar system.",
    "The highest mountain in our solar system is Olympus Mons on Mars, which is over 13 miles (22 kilometers) high.",
    "The Great Red Spot on Jupiter is a storm that has been raging for over 300 years.",
    "Mars is often called the Red Planet because of its reddish appearance.",
    "The International Space Station (ISS) is a habitable artificial satellite that orbits Earth.",
    "Saturn's rings are made up of ice particles that range in size from tiny specks to objects as large as mountains.",
    "Astronauts can grow plants in space using hydroponics.",
    "There is no sound in space, as there is no atmosphere to carry sound waves.",
    "The speed of light is approximately 186,282 miles per second (299,792 kilometers per second).",
    "The universe is expanding at an accelerating rate.",
    "The first American woman to travel into space was Sally Ride, in 1983.",
    "Uranus is often referred to as the 'ice giant' because of its composition.",
    "The first spacecraft to land on Mars was the Viking 1 lander, in 1976.",
    "There are more than 170 moons in our solar system.",
    "In 2015, NASA's New Horizons spacecraft flew by Pluto, providing the first up-close images of the dwarf planet.",
    "The Pioneer 10 and 11 spacecrafts carry messages from Earth to any extraterrestrial life forms that may find them.",
    "The sun's mass is so large that it accounts for 99.8% of the total mass in our solar system.",
    "The first woman to walk in space was Soviet cosmonaut Svetlana Savitskaya, in 1984.",
    "The largest asteroid in the asteroid belt, Ceres, is also classified as a dwarf planet.",
    "Astronauts in space can grow up to 2 inches (5 centimeters) taller due to the lack of gravity compressing their spines.",
    "The James Webb Space Telescope, set to launch in 2021, will be the largest, most powerful, and complex space telescope ever built.",
    "The Oort Cloud, a hypothesized cloud of icy objects that surrounds our solar system, is thought to be the source of many comets.",
    "The most distant human-made object from Earth is the Voyager 1 spacecraft, which has traveled over 14 billion miles (23 billion kilometers) since its launch in 1977.",
    "Astronauts have to exercise for several hours each day to combat the muscle and bone loss that occurs in microgravity.",
    "In 1961, Alan Shepard became the first American to travel into space.",
    "The average temperature on the surface of Mercury can reach up to 800 degrees Fahrenheit (427 degrees Celsius) during the day, and drop to -290 degrees Fahrenheit (-180 degrees Celsius) at night.",
    "There are over 2,000 known exoplanets (planets outside our solar system) in the Milky Way galaxy.",
    "The closest black hole to Earth is V616 Monocerotis, which is about 3,000 light-years away.",
    "The biggest volcano in our solar system is Olympus Mons on Mars, which is three times taller than Mount Everest.",
    "The term 'astronaut' comes from the Greek words 'astron,' meaning star, and 'nautes,' meaning sailor.",
    "The Great Attractor is a gravitational anomaly that is pulling galaxies towards it, located about 150 million light-years away from Earth.",
    "The Apollo 11 mission, which landed astronauts Neil Armstrong and Edwin 'Buzz' Aldrin on the moon in 1969, was watched by an estimated 650 million people worldwide.",
    "The first exoplanet was discovered in 1992 orbiting a pulsar.",
    "SpaceX's Falcon Heavy rocket is currently the most powerful rocket in operation, capable of carrying up to 64 tons of cargo into orbit.",
    "The largest volcano in the solar system is Olympus Mons on Mars, which is about 13 miles (22 kilometers) high and 370 miles (600 kilometers) in diameter.",
    "The first satellite to leave Earth's gravity and orbit the moon was the Soviet Union's Luna 1, in 1959.",
    "The fastest man-made object ever launched from Earth is the Parker Solar Probe, which reached a speed of 213,200 miles per hour (343,000 kilometers per hour) during its close approach to the sun.",
    "The Kuiper Belt, beyond Neptune, is thought to be home to many dwarf planets, including Pluto.",
    "The most common type of star in the universe is a red dwarf, which is much smaller and cooler than the sun.",
    "The asteroid that is thought to have wiped out the dinosaurs 66 million years ago was approximately 6 miles (10 kilometers) in diameter.",
    "The dwarf planet Pluto is named after the Roman god of the underworld.",
    "The International Space Station orbits the Earth at a speed of about 17,500 miles per hour (28,000 kilometers per hour).",
    "The Hubble Space Telescope has captured over 1.3 million observations since its launch in 1990.",
    "Jupiter is the largest planet in our solar system, with a diameter of over 86,881 miles (139,822 kilometers).",
    "The most distant galaxy ever observed is GN-z11, which is estimated to be over 13 billion light-years away from Earth.",
    "Astronauts can't cry in space because tears won't fall due to the lack of gravity pulling them down.",
    "The Great Red Spot, a massive storm on Jupiter, has been raging for at least 350 years.",
    "The first animal to orbit the Earth was a dog named Laika, sent by the Soviet Union in 1957.",
    "Saturn's rings are made up of millions of individual particles of ice and rock, ranging in size from a grain of sand to the size of a small house.",
    "The asteroid belt, located between Mars and Jupiter, contains millions of asteroids ranging in size from tiny pebbles to dwarf planets.",
    "The highest mountain in the solar system is Olympus Mons on Mars, which is about 16 miles (25 kilometers) high.",
    "The universe is thought to be about 13.8 billion years old.",
    "The first American woman to travel into space was Sally Ride, in 1983.",
    "Mars is sometimes called the 'Red Planet' due to its reddish appearance, caused by iron oxide (rust) on its surface.",
    "The fastest rotating planet in our solar system is Jupiter, which rotates once every 9.9 hours.",
    "The largest moon in our solar system is Ganymede, which orbits Jupiter and is even larger than the planet Mercury.",
    "The first person to orbit the Earth was Soviet cosmonaut Yuri Gagarin, in 1961.",
    "Astronauts on the International Space Station see 16 sunrises and sunsets every day, due to the station's orbit around the Earth.",
    "The largest planet in the solar system is Jupiter, with a mass over 300 times that of Earth.",
    "The closest star to Earth, aside from the sun, is Proxima Centauri, located about 4.24 light-years away.",
    "The Cassini-Huygens spacecraft, which explored Saturn and its moons, was in operation from 1997 to 2017.",
    "The first satellite launched into orbit was the Soviet Union's Sputnik 1, in 1957.",
    "Venus is the hottest planet in our solar system, with a surface temperature that can reach up to 864 degrees Fahrenheit (462 degrees Celsius).",
    "The Hubble Space Telescope's primary mirror is 7.9 feet (2.4 meters) in diameter.",
    "The first American to walk in space was astronaut Ed White, in 1965.",
    "The largest canyon in our solar system is Valles Marineris on Mars, which is over 2,500 miles (4,000 kilometers) long.",
    "The first successful Mars mission was NASA's Viking 1, which landed on the planet in 1976.",
    "Black holes are so dense that their gravitational pull is strong enough to prevent even light from escaping",
  ];

export class spaceFact {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
        .setName("spacefact")
        .setDescription("Get a fact about space!")
        .setExecute(async ({interaction, client}) => {
            const fact = facts[Math.floor(Math.random() * facts.length)];

            const embed = new EmbedBuilder()
              .setTitle('Space Fact')
              .setDescription(fact)
              .setColor([51, 66, 174])

            interaction.reply({embeds: [embed]});
    })
];


async onStart() {
  return true;
}
}

export default new spaceFact();