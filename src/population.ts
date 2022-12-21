type AggResponse = {
  id: number;
  average: number;
  factions: { nc: number; tr: number; vs: number };
}[];

export const getAllPopulations = async (): Promise<AggResponse> => {
  const res = await fetch(`https://agg.ps2.live/population/all`);
  const data: AggResponse = await res.json();
  return data;
};
