export default {
  requireLogin: false,
  isAllowedPath: (path: string): boolean => ["/intro", "/login", "/signup"].includes(path),
  apiHost: "https://api.ctf-archive.com",
};
