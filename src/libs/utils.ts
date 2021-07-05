import type { IProblem, IContest } from "../types";

// Charsets

const numeric = "0123456789";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const special = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
const alphabet = uppercase + lowercase;
const alphanumeric = numeric + alphabet;
const printable = alphanumeric + special;

export const charsets = {
  numeric,
  uppercase,
  lowercase,
  special,
  alphabet,
  alphanumeric,
  printable,
};

// Utils

export const compString = (a: string, b: string): -1 | 0 | 1 => (a < b ? -1 : a > b ? 1 : 0);

export const compStringArray = (a: string[], b: string[]): -1 | 0 | 1 => {
  const n: number = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) {
      return a[i] < b[i] ? -1 : 1;
    }
  }
  if (a.length !== b.length) {
    return a.length < b.length ? -1 : 1;
  }
  return 0;
};

export const compCategories = (a: string[], b: string[]): -1 | 0 | 1 => {
  if (a.length !== b.length) {
    return a.length < b.length ? -1 : 1;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return a[i] < b[i] ? -1 : 1;
    }
  }
  return 0;
};

export const compProblem = (a: IProblem, b: IProblem): number =>
  compCategories(a.categories, b.categories) || a.level - b.level;

// Random

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

export const randomProblems = (
  count: number,
  titleCharset: string = charsets.alphabet + "      ",
  sourceCharset: string = charsets.alphanumeric
): IProblem[] =>
  Array.from(new Array(count), (x, i) => ({
    id: i + 1,
    level: randomInt(30, 1),
    categories: Array.from(
      new Set(
        Array.from(
          new Array(randomCategorySize()),
          () => ["web", "pwn", "rev", "crypto", "fore", "misc"][randomInt(6)]
        )
      )
    ).sort(compString),
    title: randomString(randomInt(24, 8), titleCharset),
    source: randomContestTitle(sourceCharset),
    solves: randomInt(1000),
  }));

export const randomContests = (count: number): IContest[] =>
  Array.from(new Array(count), (x, i) => ({
    id: i + 1,
    level: randomInt(30, 1),
    problems: randomProblems(randomInt(20, 10)).sort(compProblem),
    title: randomContestTitle(),
  }));

// 디버깅용
export const nextInt = (init: number = Number.MAX_SAFE_INTEGER): number => {
  if (init !== Number.MAX_SAFE_INTEGER) {
    lastNextIntValue = init;
  }
  return lastNextIntValue++;
};

// Promise

export const delay = <T>(value: T, timeout: number = 750): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, timeout);
  });

// Escape

export const escapeEmpty = (c: string) => "";

export const escapeBackslash = (c: string) => "\\" + c;

export const escapeURL = (c: string) => "%" + c.charCodeAt(0).toString(16);

export const escapeBlock = (
  str: string,
  charset: string,
  replacer: (substring: string, ...args: any[]) => string = escapeEmpty
): string =>
  str.replace(new RegExp(`[${charset.replace(/[\-\\]\^\]]/g, escapeBackslash)}]`), replacer);

export const escapeAllow = (
  str: string,
  charset: string,
  replacer: (substring: string, ...args: any[]) => string = escapeEmpty
): string =>
  str.replace(new RegExp(`[^${charset.replace(/[\-\\]\^\]]/g, escapeBackslash)}]`), replacer);

// Exp

export const expToLevel = (exp: number, precision: number = 1) => {
  const level = Math.max(Math.floor(Math.log2(exp)) - 5, 1);
  const remain = Math.pow(2, level + 6) - exp;
  const percentage = Math.floor((exp / Math.pow(2, level + 5) - 1) * (precision * 100)) / precision;
  return { level, remain, percentage };
};

// Local Storage

export const getLocalStorage = <T = unknown>(key: string, initialValue?: T) => (): T | null => {
  const value = localStorage.getItem(key);
  if (value === null) return initialValue ?? null;
  return JSON.parse(value);
};
export const setLocalStorage = <T = unknown>(key: string) => async (value: T | null) => {
  if (value === null) {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
};
