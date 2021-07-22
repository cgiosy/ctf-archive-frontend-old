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
  const level = Math.max(Math.floor(Math.log2(exp)) - 3, 1);
  const remain = Math.pow(2, level + 3) - exp;
  const percentage = Math.floor((exp / Math.pow(2, level + 3) - 1) * (precision * 100)) / precision;
  return { level, remain, percentage };
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
