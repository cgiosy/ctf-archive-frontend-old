import * as fs from "fs";
import subsetFont from "subset-font";

const reduceFont = (originalFontPath, reducedFontPath, subset) => {
  const base = "public/assets/fonts/";
  const originalFont = fs.readFileSync(base + originalFontPath);
  subsetFont(originalFont, subset, {
    targetFormat: "woff2",
  }).then((reducedFont) => {
    fs.writeFileSync(base + reducedFontPath, reducedFont);
  });
};

const printableChars = [];
for (let i = 32; i <= 126; i++) {
  printableChars.push(String.fromCharCode(i));
}

const koChars = fs.readFileSync("./src/constants/ko.json") + printableChars;
const titleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#,. ";

for (const weight of ["Bold", "ExtraBold", "Light", "Medium", "Regular", "SemiBold"]) {
  reduceFont(`Pretendard-${weight}.otf`, `Pretendard-${weight}.woff2`, koChars);
}

for (const weight of ["Black", "Bold", "ExtraBold", "Medium", "Regular", "SemiBold"]) {
  reduceFont(`Montserrat-${weight}.ttf`, `Montserrat-${weight}.woff2`, titleChars);
}
