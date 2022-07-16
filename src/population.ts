export const getPopulation = async (worldID: string): Promise<number> => {
  return (await getAllPopulations(worldID)).average;
};

const getVoidwellPopulation = async (worldID: string): Promise<number> => {
  const res = await fetch(`https://api.voidwell.com/ps2/worldstate/${worldID}`);
  const data: { onlineCharacters: number } = await res.json();

  return data.onlineCharacters;
};

const getFisuPopulation = async (worldID: string): Promise<number> => {
  const res = await fetch(
    `https://ps2.fisu.pw/api/population/?world=${worldID}`
  );
  const data: { result: { vs: number; nc: number; tr: number; ns: number }[] } =
    await res.json();

  const { vs, nc, tr, ns } = data.result[0];
  return vs + nc + tr + ns;
};

const getHonuPopulation = async (worldID: string): Promise<number> => {
  const res = await fetch(`https://wt.honu.pw/api/population/${worldID}`);
  const data: { total: number } = await res.json();

  return data.total;
};

export const getAllPopulations = async (
  worldID: string
): Promise<{
  average: number;
  fisu: number;
  honu: number;
  voidwell: number;
}> => {
  const values = await Promise.all([
    getHonuPopulation(worldID).catch(() => -1),
    getVoidwellPopulation(worldID).catch(() => -1),
    getFisuPopulation(worldID).catch(() => -1),
  ]);

  const [honu, voidwell, fisu] = values;

  const workingValues = values.filter((v) => v !== -1);

  return {
    honu,
    voidwell,
    fisu,
    average: Math.floor(
      workingValues.reduce((a, b) => a + b, 0) / workingValues.length
    ),
  };
};
