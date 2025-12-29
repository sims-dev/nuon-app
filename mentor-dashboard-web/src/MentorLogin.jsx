import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const DUMMY_CREDENTIALS = {
  username: 'mentor@nuonhub.com',
  password: 'mentor@123',
};


const MentorLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      console.log('Attempting login with:', { username, password });

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/mentor-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      const data = await response.json();
      console.log('Login response status:', response.status);
      console.log('Login response ok:', response.ok);
      console.log('Login response data:', data);
      console.log('Has accessToken:', !!data.accessToken);

      if (response.ok && data.accessToken) {
        const user = data.user;
        const accessToken = data.accessToken;
        const refreshToken = data.refreshToken;
        console.log('Login successful. User:', user);
        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        login({ user, accessToken, refreshToken });
        navigate('/mentor/home');
      } else {
        console.error('Login failed:', data.message);
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: '80px auto', padding: 24, background: '#181818', borderRadius: 8, color: '#fff' }}>
      <h2 style={{ textAlign: 'center' }}>Mentor Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="mentor-username">Username</label>
          <input
            id="mentor-username"
            name="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #333', marginTop: 4 }}
            autoFocus
            autoComplete="username"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="mentor-password">Password</label>
          <input
            id="mentor-password"
            name="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #333', marginTop: 4 }}
            autoComplete="current-password"
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: 10, background: '#0af', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold' }}>
          Login
        </button>
      </form>
      <div style={{ marginTop: 24, fontSize: 13, color: '#aaa' }}>
        <div>Demo credentials:</div>
        <div>Email: <b>mentor@nuonhub.com</b></div>
        <div>Password: <b>mentor@123</b></div>
      </div>
    </div>
  );
};

export default MentorLogin;
