import * as fs from "fs";
import subsetFont from "subset-font";

const reduceFont = (originalFontPath, reducedFontPath, subset) => {
  const originalFont = fs.readFileSync(originalFontPath);
  subsetFont(originalFont, subset, {
    targetFormat: "woff2",
  }).then((reducedFont) => {
    fs.writeFileSync(reducedFontPath, reducedFont);
  });
};

const printableChars = [];
for (let i = 32; i <= 126; i++) {
  printableChars.push(String.fromCharCode(i));
}

const koChars = fs.readFileSync("./src/constants/ko.json") + printableChars;
const titleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#,. ";
const inDir = "fonts/";
const outDir = "public/assets/fonts/";

for (const weight of ["Bold", "ExtraBold", "Light", "Medium", "Regular", "SemiBold"]) {
  reduceFont(inDir + `Pretendard-${weight}.otf`, outDir + `Pretendard-${weight}.woff2`, koChars);
}

for (const weight of ["Black", "Bold", "ExtraBold", "Medium", "Regular", "SemiBold"]) {
  reduceFont(inDir + `Montserrat-${weight}.ttf`, outDir + `Montserrat-${weight}.woff2`, titleChars);
}
