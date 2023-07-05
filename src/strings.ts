import { emojiBarGraph } from "./emoji-bar-graph";
import { emojis } from "./emojis.gen";
import { Metagame } from "./metagame";
import { getAllPopulations } from "./population";
import { AlertType, Continent } from "./types";

const serverNames = {
  "13": "Cobalt",
  "1": "Connery",
  "17": "Emerald",
  "19": "Jaeger",
  "10": "Miller",
  "40": "SolTech",
  "1000": "Genudine",
  "2000": "Ceres",
};

const continentNames = {
  [Continent.Indar]: "Indar",
  [Continent.Hossin]: "Hossin",
  [Continent.Amerish]: "Amerish",
  [Continent.Esamir]: "Esamir",
  [Continent.Oshur]: "Oshur",
};

const alertTypeEmoji = {
  [AlertType.Conquest]: "🚨",
  [AlertType.Max]: "🍔",
  [AlertType.Air]: "🛫",
  [AlertType.SuddenDeath]: "💀",
  [AlertType.None]: " ",
  conquest: "🚨",
  max: "🍔",
  air: "🛫",
  sudden_death: "💀",
};

export const serverListingPopulation = (
  serverId: string,
  population: number
) => {
  const serverName = serverNames[serverId as any as keyof typeof serverNames];

  if (population < 1) {
    return `${serverName}｜ No players online.`;
  }

  return `${serverName}｜${population || 0} online`;
};

export const serverListingContinents = (metagame: Metagame) => {
  const continents = metagame.zones.reduce<string[]>((acc, zone) => {
    if (zone.locked) {
      return acc;
    }

    const continentName =
      continentNames[zone.id as keyof typeof continentNames];
    const alertType = zone.alert?.alert_type;

    const alertEmoji =
      alertTypeEmoji[alertType as keyof typeof alertTypeEmoji] || " ";
    return [...acc, `${alertEmoji} ${continentName}`];
  }, []);
  return `···${continents.join(",")}`;
};

export const serverStatsEmbed = (
  populations: Awaited<ReturnType<typeof getAllPopulations>>
) => {
  const {
    average: avgTotal,
    averages: { nc, tr, vs },
  } = populations;
  const popTotal = nc + tr + vs;

  const status = {
    color: 0x000000,
    title: `${emojis.compass} Emerald Status`,
    timestamp: new Date().toISOString(),
    fields: [
      {
        name: "Server Population",
        value: `${
          emojis.population
        } ${avgTotal} players online\n${emojiBarGraph(nc, tr, vs)}`,
      },
      {
        name: emojis.nc,
        value: `${Math.round((nc / popTotal) * 100)}%`,
        inline: true,
      },
      {
        name: emojis.tr,
        value: `${Math.round((tr / popTotal) * 100)}%`,
        inline: true,
      },
      {
        name: emojis.vs,
        value: `${Math.round((vs / popTotal) * 100)}%`,
        inline: true,
      },
      {
        name: `${emojis.continent} Continents`,
        value: "🚨 Amerish, Indar".replaceAll("🚨", emojis.alert),
      },
    ],
  };

  const startTime = new Date("2022-08-07T22:52:27.000Z").getTime();
  const duration = 5400000;
  const endTime = startTime + duration;

  const alerts = [
    {
      color: 0x3333ff,
      title: `${emojis.alert} ALERT: Amerish Conquest`,
      description: `[View on PS2Alerts](https://ps2alerts.com/alert/17-44494)
        Started <t:${(startTime / 1000).toFixed(0)}:R>
        Ends <t:${(endTime / 1000).toFixed(0)}:R>`,
      fields: [
        {
          name: `${emojis.population} Continent Population`,
          value: emojiBarGraph(33, 33, 100),
        },
        {
          name: emojis.nc,
          value: "33%",
          inline: true,
        },
        {
          name: emojis.tr,
          value: "33%",
          inline: true,
        },
        {
          name: emojis.vs,
          value: "34%",
          inline: true,
        },
        {
          name: `${emojis.compass} Territory`,
          value: emojiBarGraph(33, 1, 34),
        },
        {
          name: emojis.nc,
          value: "33%",
          inline: true,
        },
        {
          name: emojis.tr,
          value: "33%",
          inline: true,
        },
        {
          name: emojis.vs,
          value: "34%",
          inline: true,
        },
      ],
      footer: {
        text: "Stats provided by PS2Alerts.\nStats are delayed, last update",
      },
      timestamp: new Date().toISOString(),
    },
  ];

  return [status, ...alerts];
};
