export const permutations = [
  ["nc", "nc", "nc", "nc"],
  ["tr", "tr", "tr", "tr"],
  ["vs", "vs", "vs", "vs"],

  // NC to TR gradient
  ["nc", "nc", "nc", "tr"],
  ["nc", "nc", "tr", "tr"],
  ["nc", "tr", "tr", "tr"],

  // NC to VS gradient
  ["nc", "nc", "nc", "vs"],
  ["nc", "nc", "vs", "vs"],
  ["nc", "vs", "vs", "vs"],

  // TR to VS gradient
  ["tr", "tr", "tr", "vs"],
  ["tr", "tr", "vs", "vs"],
  ["tr", "vs", "vs", "vs"],

  // Edge cases with 3 factions
  ["nc", "nc", "tr", "vs"],
  ["nc", "tr", "tr", "vs"],
  ["nc", "tr", "vs", "vs"],
];
