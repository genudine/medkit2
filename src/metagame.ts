export type Metagame = {
  id: number;
  zones: {
    id: number;
    locked: boolean;
    alert?: {
      id: number;
      zone: number;
      start_time: string;
      end_time: string;
      alert_type: "conquest" | "sudden_death" | "air";
      ps2alerts: string;
    };
    territory: {
      nc: number;
      tr: number;
      vs: number;
    };
  }[];
};

export const getMetagame = async (): Promise<Metagame[]> => {
  const res = await fetch(`https://metagame.ps2.live/all`);
  const data: Metagame[] = await res.json();
  return data;
};
