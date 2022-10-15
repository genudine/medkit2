import { emojis } from "./emojis.gen";

export const emojiBarGraph = (nc: number, tr: number, vs: number) => {
  if (!(nc >= 0 && tr >= 0 && vs >= 0)) {
    return "";
  }

  // Normalize the values to be between 0 and 1
  const total = nc + tr + vs;
  const avg = total / 3;
  const ncAvg = nc / avg;
  const trAvg = tr / avg;
  const vsAvg = vs / avg;

  // round averages to the nearest 1/40
  let ncAvgRounded = Math.round((ncAvg * 40) / 3);
  let trAvgRounded = Math.round((trAvg * 40) / 3);
  let vsAvgRounded = Math.round((vsAvg * 40) / 3);
  let avgRoundedTotal = ncAvgRounded + trAvgRounded + vsAvgRounded;

  console.log("main math", {
    ncAvgRounded,
    trAvgRounded,
    vsAvgRounded,
    avgRoundedTotal,
  });

  const correctTotals = (): void => {
    console.log("pre-correction", {
      ncAvgRounded,
      trAvgRounded,
      vsAvgRounded,
      avgRoundedTotal,
    });

    if (avgRoundedTotal > 40) {
      // correct largest value -1
      if (ncAvgRounded > trAvgRounded && ncAvgRounded > vsAvgRounded) {
        ncAvgRounded--;
      } else if (trAvgRounded > ncAvgRounded && trAvgRounded > vsAvgRounded) {
        trAvgRounded--;
      } else {
        vsAvgRounded--;
      }
    } else if (avgRoundedTotal < 40) {
      // correct smallest value +1
      if (ncAvgRounded < trAvgRounded && ncAvgRounded < vsAvgRounded) {
        ncAvgRounded++;
      } else if (trAvgRounded < ncAvgRounded && trAvgRounded < vsAvgRounded) {
        trAvgRounded++;
      } else {
        vsAvgRounded++;
      }
    }
    avgRoundedTotal = ncAvgRounded + trAvgRounded + vsAvgRounded;
    console.log("post-correction", {
      ncAvgRounded,
      trAvgRounded,
      vsAvgRounded,
      avgRoundedTotal,
    });

    if (avgRoundedTotal !== 40) {
      return correctTotals();
    }
  };

  if (avgRoundedTotal !== 40) {
    correctTotals();
  }

  // Create the bar graph using "nc" "tr" and "vs"
  let graph = [];

  for (let i = 0; i < ncAvgRounded; i++) {
    graph.push("nc");
  }
  for (let i = 0; i < trAvgRounded; i++) {
    graph.push("tr");
  }
  for (let i = 0; i < vsAvgRounded; i++) {
    graph.push("vs");
  }

  let graphStr = "";

  // Loop over blocks of 4
  for (let i = 0; i < graph.length; i += 4) {
    // Create a string of the 4 emoji
    const emojiKey = graph.slice(i, i + 4).join("-");

    // Add the emoji to the string
    graphStr += emojis[emojiKey as keyof typeof emojis];
  }

  return graphStr;
};
