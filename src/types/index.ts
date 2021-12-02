export enum ProblemCategory {
  Pwnable,
  Reversing,
  Crypto,
  Web,
  Forensic,
  Misc,
}

export enum UserAuth {
  User = 1,
  Creator = 10,
  Admin = 100,
}

export enum ProblemType {
  BuildFileExist = 1 << 0,
  ProblemFileExist = 1 << 1,
  Solved = 1 << 2,
}

export enum SearchType {
  Title = 0,
  Contest = 1,
  Tag = 2,
  Level = 3,
  Solves = 4,
  User = 5,

  NotTitle = ~0,
  NotContest = ~1,
  NotTag = ~2,
  NotLevel = ~3,
  NotSolves = ~4,
  NotUser = ~5,
}

export type Levels = [number, number, number, number, number, number];

export type Exps = [number, number, number, number, number, number];

export interface ISearchQuery {
  types: SearchType;
  value: string;
}

export interface ISuggestion extends ISearchQuery {
  caption: string;
  score: number;
}

export interface IProblem {
  id: number;
  levels: Levels;
  title: string;
  source: string;
  solves: number;
}

export interface ISubmission {
  username: string;
  profileImage: string;
  exps: Exps;
  levels: Levels;
  comment: string;
  time: string;
  commentTime: string;
}

export interface IProblemDetails {
  levels: Levels;
  title: string;
  source: string;
  license: string;
  uuid: string;
  content: string;
  solves: number;
  types: number;
  group: string;
  tags: number[];
  flag?: string | null;
  submission?: ISubmission | null;
}

export interface IStatus {
  id: number;
  port: number;
  used: number;
  remain: number;
}

export interface IContest {
  id: number;
  problems: IProblem[];
  title: string;
}

export interface IUserMiniInfo {
  username: string;
  solves: number;
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
  exps: Exps;
  achievements: number[];
  description: string;
  favoriteAchievement: number;
  profileImage: string;
  profileBackground: string;
}

export interface IUserPrivateInfo extends IUserPublicInfo {
  auth: number;
  email: string;
  friends: number[];
  settings: string;
}
