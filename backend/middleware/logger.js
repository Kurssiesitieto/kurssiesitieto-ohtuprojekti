const winston = require("winston");
const { format, transports } = winston;
const { consoleFormat } = require("winston-console-format");

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    verbose: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    verbose: "green",
    info: "white",
    debug: "cyan",
  },
};

winston.addColors(customLevels.colors);

const level = process.env.LOGGING_LEVEL || "debug";

const logger = winston.createLogger({
  levels: customLevels.levels,
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.colorize({ all: true }),
    format.padLevels(), // Does NOT like custom message types.
    consoleFormat({
      showMeta: true,
      metaStrip: ["timestamp", "service"],
      inspectOptions: {
        depth: Infinity,
        colors: true,
        maxArrayLength: Infinity,
        breakLength: 80,
        compact: Infinity,
      },
    })
  ),
  transports: [
    new transports.Console({
      level,
    }),
    new winston.transports.File({
      filename: "combined.log",
    }),
    new winston.transports.File({
      filename: "app.error.log",
      level: "error",
    }),
  ],
});

module.exports = logger;
