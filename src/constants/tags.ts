export const tidToTag = [
  ["Pwnable", "Pwn", "포너블", "시스템 해킹"],
  ["Reversing", "Rev", "리버싱", "역공학"],
  ["Cryptography", "Crypto", "크립토", "암호학"],
  ["Web", "웹"],
  ["Forensic", "Fore", "포렌식"],
  ["Misc"],
] as const;

export const tagToTid: { [tag: string]: number } = {};

tidToTag.forEach((tags, tid) => {
  tags.forEach((tag) => {
    tagToTid[tag] = tid;
  });
});
