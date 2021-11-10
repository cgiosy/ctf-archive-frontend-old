import marked from "marked/lib/marked.esm";
import DOMPurify from "dompurify/dist/purify.es";
import { ProblemCategory } from "../types";
import type { Exps, Levels } from "../types";

export const useVars = (...args: unknown[]) => {};

export const markdown = (text: string) => DOMPurify.sanitize(marked(text));

export const style = (styles: { [key: string]: string | number | boolean | null | undefined }) =>
  Object.entries(styles)
    .filter((arr) => arr[1])
    .map((arr) => arr[0] + ":" + arr[1])
    .join(";");

export const getImageUrl = (uuid: string) =>
  uuid !== "00000000-0000-0000-0000-000000000000" &&
  uuid.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
    ? "//cdn.ctf-archive.com/images/" + uuid
    : null;

export const emptyImageUrl =
  "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22/%3E";

const flooredHalf = (x: number, eps: number = 1) => {
  x /= 2;
  return x - Math.abs(x % eps);
};

export const binSearch = (
  pred: (i: number) => boolean,
  r: number,
  l: number = 0,
  eps: number = 1
) => {
  while (r - l >= eps) {
    const m = flooredHalf(l + r, eps);
    if (pred(m)) r = m;
    else l = m + eps;
  }
  return r;
};

export const llcs = (a: string, b: string) => {
  const n = a.length;
  const m = b.length;
  const dp = [new Uint32Array(m + 1), new Uint32Array(m + 1)] as const;
  for (let i = 0; i < n; i++) {
    const prv = dp[i & 1];
    const cur = dp[~i & 1];
    for (let j = 0; j < m; j++)
      cur[j + 1] = Math.max(Math.max(prv[j + 1], cur[j]), a[i] == b[j] ? (prv[j] + 1) | 0 : 0);
  }
  return dp[n & 1][m];
};

const alphaNumericalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");

export const editDistance = (from: string, to: string, delCost = 1, insCost = 1) =>
  from.length * delCost + to.length * insCost - llcs(from, to) * (delCost + insCost);

export const tagEditDistance = (from: string, to: string, delCost = 2, insCost = 1) =>
  editDistance(alphaNumericalize(from), alphaNumericalize(to), delCost, insCost);

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

// Colors

export const categoryColors: { readonly [key in ProblemCategory]: string } = {
  [ProblemCategory.Pwnable]: "rgb(252, 40, 157)",
  [ProblemCategory.Reversing]: "rgb(78, 224, 174)",
  [ProblemCategory.Crypto]: "rgb(247, 147, 7)",
  [ProblemCategory.Web]: "rgb(66, 198, 220)",
  [ProblemCategory.Forensic]: "rgb(241, 222, 64)",
  [ProblemCategory.Misc]: "rgb(164, 109, 254)",
};

export const setColorOpacity = (color: string, opacity: number) =>
  color.replace(/rgb\((.+)\)|rgba\((.+),.+?\)/, `rgba($1$2, ${opacity})`);

// Promise

export const delay = <T>(value: T, timeout: number = 300): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, timeout);
  });

// Stream

type DoneValue<T> = { done: false; value: T } | { done: true; value?: void };

async function* makeStreamIterator<T>(stream: ReadableStream<T>) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

export const proxyStream = <T>(
  stream: ReadableStream<T>,
  onStream: (args: DoneValue<T>) => unknown
): ReadableStream => {
  return new ReadableStream({
    async start(controller: ReadableStreamController<T>) {
      for await (const value of makeStreamIterator(stream)) {
        if (value === undefined) continue;
        controller.enqueue(value);
        onStream({ done: false, value });
      }
      controller.close();
      onStream({ done: true });
    },
  });
};

// Copy

export const fallbackCopyTextToClipboard = (text: string) => {};
export const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const elm = document.createElement("textarea");
    elm.value = text;

    elm.style.top = "0";
    elm.style.left = "0";
    elm.style.position = "fixed";

    document.body.appendChild(elm);
    elm.focus();
    elm.select();
    document.execCommand("copy");
    document.body.removeChild(elm);
  }
};

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

export const expTable = [
  10,
  20,
  39,
  75,
  139, // 5
  252,
  447,
  774,
  1309,
  2160, // 10
  3500,
  5565,
  8682,
  13284,
  19926, // 15
  29491,
  43057,
  62003,
  88045,
  123263, // 20
  171336,
  236444,
  323929,
  440544,
  594735, // 25
  796945,
  1059937,
  1399117,
  1832844,
  2382698, // 30
] as const;

export const levelsSum = (levels: Exps): number =>
  levels[0] + levels[1] + levels[2] + levels[3] + levels[4] + levels[5];

export const expsSum = (exps: Exps): number =>
  exps[0] + exps[1] + exps[2] + exps[3] + exps[4] + exps[5];

export const levelsToCategories = (levels: Exps): ProblemCategory[] => {
  const categories: ProblemCategory[] = [];
  if (levels[0] > 0) categories.push(ProblemCategory.Pwnable);
  if (levels[1] > 0) categories.push(ProblemCategory.Reversing);
  if (levels[2] > 0) categories.push(ProblemCategory.Crypto);
  if (levels[3] > 0) categories.push(ProblemCategory.Web);
  if (levels[4] > 0) categories.push(ProblemCategory.Forensic);
  if (levels[5] > 0) categories.push(ProblemCategory.Misc);
  return categories;
};

export const expsToCategories = (exps: Exps): ProblemCategory[] => {
  const categories: ProblemCategory[] = [];
  if (exps[0] > 0) categories.push(ProblemCategory.Pwnable);
  if (exps[1] > 0) categories.push(ProblemCategory.Reversing);
  if (exps[2] > 0) categories.push(ProblemCategory.Crypto);
  if (exps[3] > 0) categories.push(ProblemCategory.Web);
  if (exps[4] > 0) categories.push(ProblemCategory.Forensic);
  if (exps[5] > 0) categories.push(ProblemCategory.Misc);
  return categories;
};

export const expToLevel = (exp: number, precision: number = 1) => {
  const level = binSearch((i) => exp < expTable[i] * 10, expTable.length);
  const curLevelExp = level === expTable.length ? Infinity : expTable[level];
  const prvLevelExp = level === 0 ? 0 : expTable[level - 1];
  const remain = curLevelExp - exp;
  const percentage =
    Math.floor((remain / (curLevelExp - prvLevelExp)) * (precision * 100)) / precision;
  return { level, remain, percentage };
};

export const levelToExp = (level: number): number => (level > 0 ? expTable[level - 1] : 0);

export const levelsToExp = (levels: Levels): number =>
  levelToExp(levels[0]) +
  levelToExp(levels[1]) +
  levelToExp(levels[2]) +
  levelToExp(levels[3]) +
  levelToExp(levels[4]) +
  levelToExp(levels[5]);

export const levelsToLevel = (levels: Levels) => {
  const exp = levelsToExp(levels);
  return binSearch((i) => exp < expTable[i], expTable.length);
};

// Local Storage

export const getLocalStorage =
  <T = unknown>(key: string, initialValue?: T) =>
  (): T | null => {
    const value = localStorage.getItem(key);
    if (value === null) return initialValue ?? null;
    return JSON.parse(value);
  };

export const setLocalStorage =
  <T = unknown>(key: string) =>
  async (value: T | null) => {
    if (value === null) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  };
