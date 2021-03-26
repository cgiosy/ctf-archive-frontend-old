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

// Random

const BUFFER_SIZE = 16384;
const buffer = new Uint32Array(BUFFER_SIZE);
let pos = BUFFER_SIZE;

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

// Promise

export const delay = <T>(value: T, timeout: number = 750): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, timeout);
  });
