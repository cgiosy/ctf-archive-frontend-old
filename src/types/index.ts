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

export interface IUserPublicInfo {
  username: string;
  problems: number[];
  exp: number[];
  achievements: number[];
  description: string;
  profileImage: string;
  profileBackground: string;
}

export interface IUserPrivateInfo extends IUserPublicInfo {
  email: string;
  friends: number[];
  settings: string;
}
