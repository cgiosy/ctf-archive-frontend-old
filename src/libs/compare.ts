import type { IProblem } from "../types";

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

export const compLevels = (a: number[], b: number[]): -1 | 0 | 1 => {
  let cntA = 0;
  let cntB = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== 0) cntA += 1;
  for (let i = 0; i < b.length; i++) if (b[i] !== 0) cntB += 1;
  if (cntA !== cntB) {
    return cntA < cntB ? -1 : 1;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return b[i] === 0 || (a[i] !== 0 && a[i] < b[i]) ? -1 : 1;
  }
  return 0;
};

export const compProblem = (a: IProblem, b: IProblem): number => compLevels(a.levels, b.levels);
