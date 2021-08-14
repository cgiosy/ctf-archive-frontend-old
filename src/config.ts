export default {
  isAllowedPath: (path: string): boolean => ["/api"].every((p: string) => !path.startsWith(p)),
  apiHost: "/api",
  // apiHost: "https://953d5fd2be3c.ngrok.io",
};
