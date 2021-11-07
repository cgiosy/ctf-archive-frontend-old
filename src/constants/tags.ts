export const tidToTag = [
  ["XSS", "Cross-Site Scripting"],
  ["CSRF", "Cross-Site Request Forgery", "XSRF"],
  ["SQLi", "SQL Injection"],
  ["Blind SQLi", "Blind SQL injection", "BSQLi"],
  ["MySQL", "MariaDB"],
  ["Oracle DB", "Oracle"],
  ["Side-Channel Attack"],
  ["Meltdown", "CVE-2017-5754"],
  ["Spectre", "CVE-2017-5753", "CVE-2017-5715"],
] as const;

export const tagToTid: { [tag: string]: number } = {};

tidToTag.forEach((tags, tid) => {
  tags.forEach((tag) => {
    tagToTid[tag] = tid;
  });
});
