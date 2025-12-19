import * as fs from 'fs';
import * as path from 'path';

export class Logger {
    private static logStream = fs.createWriteStream(path.join(process.cwd(), 'logs', 'server.log'), { flags: 'a' });

    static info(message: string, data?: any) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] INFO: ${message}`;
        console.log(logEntry);
        if (data) {
            console.log(data);
        }
        this.logStream.write(logEntry + '\n');
    }

    static error(message: string, error?: any) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ERROR: ${message}`;
        console.error(logEntry);
        if (error) {
            console.error(error);
        }
        this.logStream.write(logEntry + '\n');
    }

    static warn(message: string, data?: any) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] WARN: ${message}`;
        console.warn(logEntry);
        if (data) {
            console.warn(data);
        }
        this.logStream.write(logEntry + '\n');
    }
}