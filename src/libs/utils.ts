import { ProblemCategory } from "../types";
import type { Exps, Levels } from "../types";

export const useVars = (...args: unknown[]) => {};

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
  [ProblemCategory.Pwnable]: "rgb(240, 98, 146)",
  [ProblemCategory.Reversing]: "rgb(179, 136, 255)",
  [ProblemCategory.Crypto]: "rgb(255, 112, 67)",
  [ProblemCategory.Web]: "rgb(100, 181, 246)",
  [ProblemCategory.Forensic]: "rgb(67, 160, 71)",
  [ProblemCategory.Misc]: "rgb(97, 97, 97)",
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
  const level = Math.max(Math.floor(Math.log2(exp)) - 3, 0);
  const remain = Math.pow(2, level + 3) - exp;
  const percentage = Math.floor((exp / Math.pow(2, level + 3) - 1) * (precision * 100)) / precision;
  return { level, remain, percentage };
};

export const levelsToExp = (levels: Levels): number =>
  (1 << levels[0]) +
  (1 << levels[1]) +
  (1 << levels[2]) +
  (1 << levels[3]) +
  (1 << levels[4]) +
  (1 << levels[5]);

export const levelsToLevel = (levels: Levels) => Math.floor(Math.log2(levelsToExp(levels)));

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
