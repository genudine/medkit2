// fetch emojis from discord, generate the mappings based on permutations.

import fs from "fs";
import fetch from "node-fetch";
import { permutations } from "./emojis-perms.js";

if (!process.env.DISCORD_BOT_TOKEN) {
  console.warn("no DISCORD_BOT_TOKEN env var, skipping emoji generation");
  process.exit(0);
}

const resp = await fetch(
  `https://discord.com/api/v10/guilds/203493697696956418/emojis`,
  {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  }
);
const emojis = await resp.json();
const emojiMap = {
  alert: "<:alert:1005960325310447617>",
  compass: "<:compass:1005960322785485042>",
  continent: "<:continent:1005960323615956992>",
  population: "<:population:1005960327055282216>",
  nc: "<:nc:1005960328837873804>",
  tr: "<:tr:1005960326203838524>",
  vs: "<:vs:1005960324404490331>",
};

for (let perm of permutations) {
  const emoji = emojis.find((e) => e.name === perm.join(""));
  if (!emoji) {
    console.log(`${perm.join("-")} not found`);
    continue;
  }

  emojiMap[perm.join("-")] = `<:${emoji.name}:${emoji.id}>`;
}

const output = `
export const emojis = { 
    ${Object.entries(emojiMap)
      .map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)}`)
      .join(",\n")}
};
`;

fs.writeFileSync("./src/emojis.gen.ts", output);
