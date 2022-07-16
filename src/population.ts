// Get population from Voidwell
export const getPopulation = async (worldID: string): Promise<number> => {
  const req = await fetch(
    `https://api.voidwell.com/ps2/worldstate/${worldID}?platform=pc`
  );
  const data: { onlineCharacters: number } = await req.json();

  return data.onlineCharacters;
};
