import { writable } from "svelte/store";
import type { IUserPrivateInfo } from "../types";

export const login = writable(localStorage.getItem("login") === "true" ? true : false);
export const theme = writable(localStorage.getItem("theme") ?? "light");

export const loginUser = () => {
  login.set(true);
  localStorage.setItem("login", "true");
  localStorage.setItem("login", "true");
};
export const logoutUser = () => {
  login.set(false);
  localStorage.removeItem("login");
};
