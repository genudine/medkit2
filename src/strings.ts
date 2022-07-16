import { Alerts } from "./alerts";
import { LockStates } from "./locks";
import { AlertType, Continent } from "./types";

const serverNames = {
  "24": "Apex",
  "25": "Briggs",
  "13": "🏰 Cobalt",
  "1": "🍳 Connery",
  "17": "💎 Emerald",
  "19": "🚌 Jaeger",
  "10": "🍺 Miller",
  "40": "👺 SolTech",
};

const continentNames = {
  [Continent.Indar]: "Indar",
  [Continent.Hossin]: "Hossin",
  [Continent.Amerish]: "Amerish",
  [Continent.Esamir]: "Esamir",
  [Continent.Oshur]: "Oshur",
};

const alertTypeEmoji = {
  [AlertType.Conquest]: " 🚨",
  [AlertType.Max]: " 🍔",
  [AlertType.Air]: " ✈️",
  [AlertType.None]: "",
};

export const serverListingPopulation = (
  serverId: string,
  population: number
) => {
  const serverName: string =
    serverNames[serverId as any as keyof typeof serverNames];
  return `${serverName}: ${population} online`;
};

export const serverListingContinents = (
  serverId: string,
  alerts: Alerts,
  lockStates: LockStates
) => {
  const serverName: string =
    serverNames[serverId as any as keyof typeof serverNames];

  const continents = Object.keys(continentNames)
    .filter((id) => lockStates[String(id) as any] === false)
    .sort((a, b) => {
      if (alerts[+a] === AlertType.None) {
        return 1;
      }

      return -1;
    })
    .map((id) => {
      const intID = Number(id);
      return `${continentNames[intID]}${alertTypeEmoji[alerts[intID]]}`;
    });

  return `${continents.join(", ")} 🌐`;
};
