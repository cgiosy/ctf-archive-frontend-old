import { writable } from "svelte/store";

export default writable(localStorage.getItem("login") ?? "false");
