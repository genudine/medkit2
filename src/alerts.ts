import { PlatformConfig } from "./config";
import { metagameIDs } from "./metagame.gen";
import { AlertType, Continent } from "./types";

type AlertResponse = {
  world_event_list: {
    instance_id: string;
    metagame_event_state_name: "started" | "ended";
    zone_id: string;
    metagame_event_id: string;
  }[];
};

export type Alerts = Record<Continent, AlertType>;

// Get alerts from Census
export const getAlerts = async (
  serviceID: string,
  worldID: string,
  platformConfig: PlatformConfig
): Promise<Alerts> => {
  const req = await fetch(
    `https://census.daybreakgames.com/s:${serviceID}/get/${platformConfig.censusCollection}/world_event?type=METAGAME&world_id=${worldID}`
  );
  const data: AlertResponse = await req.json();

  const alertStates: Alerts = {
    [Continent.Indar]: AlertType.None,
    [Continent.Hossin]: AlertType.None,
    [Continent.Amerish]: AlertType.None,
    [Continent.Esamir]: AlertType.None,
    [Continent.Oshur]: AlertType.None,
  };

  const activeAlerts = data.world_event_list.reduceRight<
    { metagame_event_id: string; zone_id: string; instance_id: string }[]
  >((acc, event) => {
    // for every start, add to the list
    // for every end, remove from the list
    if (event.metagame_event_state_name === "started") {
      acc = [...acc, event];
    } else {
      acc = acc.filter((v) => v.instance_id !== event.instance_id);
    }

    return acc;
  }, []);

  console.log({ activeAlerts });
  activeAlerts.forEach((alert) => {
    alertStates[Number(alert.zone_id) as Continent] =
      metagameIDs[alert.metagame_event_id as keyof typeof metagameIDs] ||
      AlertType.Conquest;
  });

  return alertStates;
};
