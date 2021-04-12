export type IProblemCategory = "web" | "pwn" | "rev" | "crypto" | "fore" | "misc";

export interface IProblem {
  id: number;
  level: number;
  categories: string[];
  title: string;
  source: string;
  solves: number;
}

export interface IContest {
  id: number;
  problems: IProblem[];
  title: string;
}
