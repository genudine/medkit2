import { Alerts } from "./alerts";
import { LockStates } from "./locks";
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
  [AlertType.Air]: "✈️",
  [AlertType.None]: " ",
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

export const serverListingContinents = (
  serverId: string,
  alerts: Alerts,
  lockStates: LockStates
) => {
  const continents = Object.keys(continentNames)
    .filter((id) => lockStates[Number(id) as keyof typeof lockStates] === false)
    .sort((a, b) => {
      if (alerts[Number(a) as keyof typeof alerts] === AlertType.None) {
        return 1;
      }

      return -1;
    })
    .map((id) => {
      const intID = Number(id);
      return `${alertTypeEmoji[alerts[intID as keyof typeof alerts]]}${
        continentNames[intID as keyof typeof continentNames]
      }`;
    });

  return `···${continents.join(",")}`;
};
