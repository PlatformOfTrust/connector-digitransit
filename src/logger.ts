"use strict";

/**
 * Module dependencies.
 */
import fs from "fs";
const env = process.env.NODE_ENV || 'development';
import { createLogger, format, transports } from 'winston';
const { timestamp, printf } = format;
import 'winston-daily-rotate-file';

/**
 * Create logger.
 */

// Set directory for log files.
const logDir: string = 'log';

// Create log directory, if it does not exist.
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// Define logging format.
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

export const logger = createLogger({
  /**
   * Define logging transports.
   */
  transports: [
    new (transports.Console)({
      level: 'silly',
      format: format.combine(
        timestamp(),
        format.colorize(),
        myFormat
      ),
      handleExceptions: true
    }),
    new (transports.DailyRotateFile)(Object.assign({
      level: env === 'development' ? 'verbose' : 'info',
      filename: `${logDir}/%DATE%-results.log`,
      format: format.combine(
        timestamp(),
        format.json()
      ),
      datePattern: 'YYYY-MM-DD',
      handleExceptions: true,
      exitOnError: false
    }))
  ]
});