// Centralized IP configuration
export const IP_ADDRESS = process.env.IP_ADDRESS || '192.168.0.209';

// Common IP addresses for development
export const ALLOWED_IPS = [
    '192.168.0.116',
    '192.168.0.209',
    'localhost',
    '127.0.0.1'
];

// Get client IP from request
export function getClientIP(req: any): string {
    return req.ip ||
           req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           req.connection?.socket?.remoteAddress ||
           'unknown';
}