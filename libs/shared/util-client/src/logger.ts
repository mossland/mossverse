export const logLevels = ["trace", "verbose", "debug", "log", "info", "warn", "error"] as const;
export type LogLevel = (typeof logLevels)[number];

class Logger {
  level: LogLevel = "log";
  levelIdx = 0;
  trace(msg: any) {
    if (this.levelIdx <= 0) console.log("%c" + msg, "background: #a0a; color: #fff");
  }
  verbose(msg: any) {
    if (this.levelIdx <= 1) console.log("%c" + msg, "background: #aaa; color: #000");
  }
  debug(msg: any) {
    if (this.levelIdx <= 2) console.log("%c" + msg, "background: #0aa; color: #fff");
  }
  log(msg: any) {
    if (this.levelIdx <= 3) console.log("%c" + msg, "background: #0a0; color: #fff");
  }
  info(msg: any) {
    if (this.levelIdx <= 4) console.log("%c" + msg, "background: #0a0; color: #fff");
  }
  warn(msg: any) {
    if (this.levelIdx <= 5) console.log("%c" + msg, "background: #ff0; color: #000");
  }
  error(msg: any) {
    if (this.levelIdx <= 6) console.log("%c" + msg, "background: #f00; color: #fff");
  }
  setLevel(level: LogLevel) {
    this.level = level;
    this.levelIdx = logLevels.findIndex((l) => l === level);
  }
}
export const logger = new Logger();
