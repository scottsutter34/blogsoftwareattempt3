export const log = {
  info: (...args: any[]) => console.log("\x1b[36m[info]\x1b[0m", ...args),
  warn: (...args: any[]) => console.warn("\x1b[33m[warn]\x1b[0m", ...args),
  error: (...args: any[]) => console.error("\x1b[31m[error]\x1b[0m", ...args),
};
