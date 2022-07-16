import { AlertType, Continent } from "./types";

type AlertResponse = AlertResponseItem[];

interface AlertResponseItem {
  endDate: string;
  metagameEventId: string;
  metagameEvent: {
    type: number;
  };
  zoneId: Continent;
}

export type Alerts = Record<Continent, AlertType>;

// Get alerts from Voidwell, filter the API result by end dates that haven't occurred yet.
export const getAlerts = async (worldID: string): Promise<Alerts> => {
  const req = await fetch(
    `https://api.voidwell.com/ps2/alert/alerts/0?worldId=${worldID}&platform=pc`
  );
  const data: AlertResponse = await req.json();

  const alertStates: Alerts = {
    [Continent.Indar]: AlertType.None,
    [Continent.Hossin]: AlertType.None,
    [Continent.Amerish]: AlertType.None,
    [Continent.Esamir]: AlertType.None,
    [Continent.Oshur]: AlertType.None,
  };

  data
    .filter((alert) => new Date() < new Date(alert.endDate))
    .forEach((alert) => {
      alertStates[alert.zoneId] = detectAlertType(alert);
    });

  return alertStates;
};

const detectAlertType = (alert: AlertResponseItem): AlertType => {
  switch (alert.metagameEvent?.type) {
    case 9:
      return AlertType.Conquest;
    case 6:
      return AlertType.Max;
    case 10:
      return AlertType.Air;
    default:
      return AlertType.Conquest;
  }
};
