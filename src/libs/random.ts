import type { IProblem, IContest, IUserPublicInfo } from "../types";
import { charsets } from "./utils";
import { compProblem } from "./compare";

const BUFFER_SIZE = 16384;
const buffer = new Uint32Array(BUFFER_SIZE);
let pos = BUFFER_SIZE;
let lastNextIntValue = 1;

export const random32 = (): number => {
  if (pos === BUFFER_SIZE) {
    crypto.getRandomValues(buffer);
    pos = 0;
  }
  return buffer[pos++];
};

export const randomInt = (range: number, start: number = 0): number => {
  let x = random32();
  if (x < range) {
    const t = (-range >>> 0) % range >>> 0;
    while (x < t) x = random32();
  }
  return ((x % range >>> 0) + start) >>> 0;
};

export const randomBinomialInt = (range: number, middle: number): number => {
  let result = 0;
  for (let i = 0; i < range; i++) result += randomInt(range) < middle ? 1 : 0;
  return result;
};

export const randomString = (length: number, charset: string): string => {
  const arr = new Array(length);
  for (let i = 0; i < length; ++i) arr[i] = charset[randomInt(charset.length)];
  return arr.join("");
};

export const randomContestTitle = (
  charset: string = charsets.alphanumeric,
  range: number = 10,
  start: number = 3
): string => `${randomString(randomInt(range, start), charset)} CTF ${randomInt(10, 2021)}`;

const randomCategorySize = (dim: number = 1): number =>
  dim < 6 && randomInt(3) === 0 ? randomCategorySize(dim + 1) : dim;

const randomLevels = (): number[] => {
  const levels = [0, 0, 0, 0, 0, 0];
  do levels[randomInt(20) ? randomInt(4) : randomInt(2, 4)] = randomInt(30, 1);
  while (!randomInt(20));
  return levels;
};

export const randomProblems = (
  count: number,
  titleCharset: string = charsets.alphabet + "      ",
  sourceCharset: string = charsets.alphanumeric
): IProblem[] =>
  Array.from(new Array(count), (x, i) => ({
    id: i + 1,
    levels: randomLevels(),
    title: randomString(randomInt(24, 8), titleCharset),
    source: randomContestTitle(sourceCharset),
    solves: randomInt(1000),
  }));

export const randomProblemsWithCategory = (
  count: number,
  category: number,
  titleCharset: string = charsets.alphabet + "      ",
  sourceCharset: string = charsets.alphanumeric
): IProblem[] =>
  Array.from(new Array(count), (x, i) => ({
    id: i + 1,
    levels: randomLevels(),
    title: randomString(randomInt(24, 8), titleCharset),
    source: randomContestTitle(sourceCharset),
    solves: randomInt(1000),
  }));

export const randomContests = (count: number): IContest[] =>
  Array.from(new Array(count), (x, i) => ({
    id: i + 1,
    problems: ["web", "rev", "pwn", "crypto", "misc"]
      .map((x, i) => randomProblemsWithCategory(randomBinomialInt(8, 4), i))
      .reduce((prv, cur) => [...prv, ...cur])
      .sort(compProblem),
    title: randomContestTitle(),
  }));

export const randomUsers = (count: number): IUserPublicInfo[] =>
  Array.from(new Array(count), (x, i) => ({
    username: randomString(randomInt(7, 3), charsets.lowercase + charsets.numeric),
    problems: Array.from(new Array(randomInt(1000)), (x, i) => i),
    exp: Array.from(new Array(6), (x, i) => randomInt(1 << 26)),
    achievements: [],
    description: randomString(randomInt(50), charsets.alphanumeric + "                  "),
    profileImage: "",
    profileBackground: "",
  }));

// 디버깅용
export const nextInt = (init: number = Number.MAX_SAFE_INTEGER): number => {
  if (init !== Number.MAX_SAFE_INTEGER) {
    lastNextIntValue = init;
  }
  return lastNextIntValue++;
};
