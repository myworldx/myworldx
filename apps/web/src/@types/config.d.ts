import { config } from '@/lib/winston'
import winston from 'winston'

type LogCallback = winston.LogCallback
type LoggerKeys = keyof typeof config.levels
type LoggerLevel = keyof typeof config.levels
type LoggerLogName = string

interface CreateLogParams {
  logName: LoggerLogName
  level: LoggerLevel
  type: Exclude<LoggerKeys, 'fatal'>
  options: {
    message?: string
    callback?: LogCallback
    meta?: unknown
    infoObject?: object
  }
}

export { LoggerKeys, LoggerLevel, LoggerOptions, CreateLogParams }
