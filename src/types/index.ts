export enum ProblemCategory {
  Pwnable,
  Reversing,
  Crypto,
  Web,
  Forensic,
  Misc,
}

export type Levels = [number, number, number, number, number, number];

export type Exps = [number, number, number, number, number, number];

export interface IProblem {
  id: number;
  level: number;
  levels: Levels;
  title: string;
  source: string;
  solves: number;
}

export interface IContest {
  id: number;
  problems: IProblem[];
  title: string;
}

export interface IUserMiniInfo {
  username: string;
  solves: number;
  exp: number;
  exps: Exps;
  favoriteAchievement: number;
  description: string;
  profileImage: string;
  profileBackground: string;
}

export interface IUserPublicInfo {
  username: string;
  solves: number;
  problems: number[];
  exp: number;
  exps: Exps;
  achievements: number[];
  description: string;
  favoriteAchievement: number;
  profileImage: string;
  profileBackground: string;
}

export interface IUserPrivateInfo extends IUserPublicInfo {
  sessionid: string;
  email: string;
  friends: number[];
  settings: string;
}
