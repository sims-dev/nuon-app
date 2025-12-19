import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ZoomService {
    private readonly ZOOM_API_BASE_URL = 'https://api.zoom.us/v2';
    private readonly ZOOM_API_KEY = process.env.ZOOM_API_KEY;
    private readonly ZOOM_API_SECRET = process.env.ZOOM_API_SECRET;

    constructor() {
        if (!this.ZOOM_API_KEY || !this.ZOOM_API_SECRET) {
            console.warn('[ZoomService] Missing Zoom API credentials. Ensure ZOOM_API_KEY and ZOOM_API_SECRET are set.');
        }
    }

    async createMentorshipMeeting(hostName: string, topic: string, startTime: Date, duration: number = 60): Promise<any> {
        try {
            if (!this.ZOOM_API_KEY || !this.ZOOM_API_SECRET) {
                throw new Error('Zoom API credentials are not configured.');
            }

            const payload = {
                topic: topic || 'Mentorship Session',
                type: 2, // Scheduled meeting
                start_time: startTime.toISOString(),
                duration: duration, // Default to 60 minutes
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: false,
                    mute_upon_entry: true,
                },
            };

            const response = await axios.post(`${this.ZOOM_API_BASE_URL}/users/me/meetings`, payload, {
                headers: {
                    Authorization: `Bearer ${this.generateZoomJWT()}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        } catch (error) {
            console.error('[ZoomService] Failed to create Zoom meeting:', (error as Error).message);
            throw error;
        }
    }

    private generateZoomJWT(): string {
        const payload = {
            iss: this.ZOOM_API_KEY,
            exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
        };
        return jwt.sign(payload, this.ZOOM_API_SECRET!);
    }
}