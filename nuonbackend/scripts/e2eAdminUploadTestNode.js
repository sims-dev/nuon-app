const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE = 'http://192.168.0.209:5000';
(async () => {
  try {
    const tmpDir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'sample-image.jpg'), 'placeholder-image');
    fs.writeFileSync(path.join(tmpDir, 'sample-video.mp4'), 'placeholder-video');

    console.log('Logging in as admin...');
    const loginRes = await axios.post(`${BASE}/api/auth/login`, {
      email: 'admin@nuonhub.com',
      password: 'admin@123'
    });

    const token = loginRes.data?.accessToken || loginRes.data?.token || loginRes.data?.data?.accessToken;
    if (!token) {
      console.error('No token in login response', loginRes.data);
      process.exit(2);
    }

    console.log('Token acquired (truncated):', token.substring(0, 20) + '...');

    const form = new FormData();
    form.append('title', 'E2E Upload Test Node');
    form.append('category', 'wellness');
    form.append('description', 'Test upload via Node script');
    form.append('date', '2026-01-01');
    form.append('image', fs.createReadStream(path.join(tmpDir, 'sample-image.jpg')));
    form.append('videoFile', fs.createReadStream(path.join(tmpDir, 'sample-video.mp4')));

    console.log('Uploading...');
    const uploadRes = await axios.post(`${BASE}/api/admin/engage/activities`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders()
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    console.log('Upload response:', uploadRes.data);

    console.log('\nFiles in uploads dir:');
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (fs.existsSync(uploadsDir)) {
      console.log(fs.readdirSync(uploadsDir));
    } else {
      console.log('uploads dir not found');
    }

    console.log('\nFetching activities...');
    const activities = await axios.get(`${BASE}/api/engage/activities?limit=10`);
    console.log('Activities result:', activities.data);

    process.exit(0);
  } catch (err) {
    console.error('E2E script error:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
})();
