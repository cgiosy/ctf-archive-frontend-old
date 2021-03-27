export default {
  requireLogin: false,
  isAllowedPath: (path: string): boolean => ["/intro", "/login", "/signup"].includes(path),
};
