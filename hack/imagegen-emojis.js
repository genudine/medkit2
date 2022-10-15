import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { permutations } from "./emojis-perms.js";

const factionColors = {
  nc: {
    inner: "#5ABCF9",
    middle: "#3B93F1",
    outer: "#2459B8",
    lineOuter: "#C55E01",
    lineInner: "#F4DB4A",
  },
  tr: {
    inner: "#F6836B",
    middle: "#E95B48",
    outer: "#A8251F",
    lineOuter: "#515151",
    lineInner: "#D4D4D4",
  },
  vs: {
    inner: "#E382F1",
    middle: "#C65ADF",
    outer: "#693292",
    lineOuter: "#01B770",
    lineInner: "#69ECFF",
  },
};

const createSVG = (colors = []) => `
<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${colors
    .map((color, idx) => {
      const offset = idx * 32;
      return `
      <g>
        <!-- TOP BAR -->
        <rect x="${2.5 + offset}" y="2.5" width="27" height="107" fill="${
        color.outer
      }" stroke="${color.outer}" stroke-width="5" stroke-linejoin="bevel"/>
        <rect x="${5.5 + offset}" y="5.5" width="21" height="101" fill="${
        color.middle
      }" stroke="${color.middle}" stroke-width="3" stroke-linejoin="bevel"/>
        <rect x="${9 + offset}" y="9" width="14" height="94" fill="${
        color.inner
      }" stroke="${color.inner}" stroke-width="2" stroke-linejoin="bevel"/>
        
        <!-- LOWER TOKEN -->
        <rect x="${5 + offset}" y="113" width="22" height="14" fill="${
        color.lineOuter
      }" stroke="${color.lineOuter}" stroke-width="2" stroke-linejoin="bevel"/>
        <rect x="${7 + offset}" y="114" width="18" height="11" fill="${
        color.lineInner
      }" stroke="${color.lineInner}" stroke-width="2" stroke-linejoin="bevel"/>
        <rect x="${7 + offset}" y="113" width="19" height="3" fill="${
        color.lineInner
      }"/>
        <rect x="${4 + offset}" y="112" width="24" height="2" fill="${
        color.lineOuter
      }"/>
      </g>
    `;
    })
    .join("\n")}
</svg>
`;

const outputDir = path.resolve("./hack/images/emojis/");
await fs.mkdir(outputDir, { recursive: true });

for (let perm of permutations) {
  console.log(`${perm.join("-")}.png --- started`);
  const colors = perm.map((faction) => factionColors[faction]);

  const svg = createSVG(colors);
  const svgBuf = await sharp(Buffer.from(svg)).png().toBuffer();
  console.log(`${perm.join("-")}.png - rendered`);

  const outputPath = path.join(outputDir, `${perm.join("-")}.png`);
  await fs.writeFile(outputPath, svgBuf);
  console.log(`${perm.join("-")}.png - done`);
}
