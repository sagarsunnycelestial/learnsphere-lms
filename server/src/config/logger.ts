import winston from 'winston';
const { combine, timestamp, printf } = winston.format;

const consoleFormat = printf(
  ({ level, message, timestamp, stack, ...metadata }) => {
    const metaString = Object.keys(metadata).length
      ? `${JSON.stringify(metadata)}`
      : '';
    const line = `${timestamp} [${level}]: ${message} ${metaString}`;
    return stack ? `${line}\n${stack}` : line;
  }
);
export const logger = winston.createLogger({
  format: combine(
    timestamp(),
    winston.format.errors({ stack: true }),
    consoleFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});
