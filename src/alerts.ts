import { AlertType, Continent } from "./types";

type AlertResponse = AlertResponseItem[];

interface AlertResponseItem {
  endDate: string;
  metagameEventId: string;
  metagameEvent: {
    type: number;
  };
  world: number;
  zone: Continent;
}

export type Alerts = Record<Continent, AlertType>;

// Get alerts from PS2Alerts
export const getAlerts = async (worldID: string): Promise<Alerts> => {
  const req = await fetch(
    `https://api.ps2alerts.com/instances/active?sortBy=timeStarted&world=${worldID}`
  );
  const data: AlertResponse = await req.json();

  const alertStates: Alerts = {
    [Continent.Indar]: AlertType.None,
    [Continent.Hossin]: AlertType.None,
    [Continent.Amerish]: AlertType.None,
    [Continent.Esamir]: AlertType.None,
    [Continent.Oshur]: AlertType.None,
  };

  data.forEach((alert) => {
    alertStates[alert.zone] = AlertType.Conquest;
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
