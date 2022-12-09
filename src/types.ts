export enum AlertType {
  None = -1,
  Conquest = 9,
  Max = 6,
  Air = 10,
  SuddenDeath = 1000, // Unknown
}

export enum Continent {
  Indar = 2,
  Hossin = 4,
  Amerish = 6,
  Esamir = 8,
  Oshur = 344,
}

export type QueueMessage = {
  event: "channel_name_update";
  channel_id: string;
  channel_name: string;
};
