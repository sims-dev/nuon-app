const axios = require('axios');

const ZOOM_API_BASE_URL = 'https://api.zoom.us/v2';
const ZOOM_API_KEY = process.env.ZOOM_API_KEY;
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET;

if (!ZOOM_API_KEY || !ZOOM_API_SECRET) {
  console.warn('[ZoomService] Missing Zoom API credentials. Ensure ZOOM_API_KEY and ZOOM_API_SECRET are set.');
}

async function createMentorshipMeeting(hostName, topic, startTime, duration) {
  try {
    if (!ZOOM_API_KEY || !ZOOM_API_SECRET) {
      throw new Error('Zoom API credentials are not configured.');
    }

    const payload = {
      topic: topic || 'Mentorship Session',
      type: 2, // Scheduled meeting
      start_time: new Date(startTime).toISOString(),
      duration: duration || 60, // Default to 60 minutes
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
      },
    };

    const response = await axios.post(`${ZOOM_API_BASE_URL}/users/me/meetings`, payload, {
      headers: {
        Authorization: `Bearer ${generateZoomJWT()}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('[ZoomService] Failed to create Zoom meeting:', error.message);
    throw error;
  }
}

function generateZoomJWT() {
  const jwt = require('jsonwebtoken');
  const payload = {
    iss: ZOOM_API_KEY,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
  };
  return jwt.sign(payload, ZOOM_API_SECRET);
}

module.exports = {
  createMentorshipMeeting,
};