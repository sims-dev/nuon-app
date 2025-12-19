

import React, { useEffect, useState } from 'react';
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api/mentor';

const MentorProfile = () => {
  const [profile, setProfile] = useState({ name: '', specialization: '', yearsOfExperience: '', bio: '', organization: '', profilePicture: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file, setFile] = useState(null);

  // Fetch profile from backend
  const fetchProfile = () => {
    setLoading(true);
    fetch(`${API_BASE}/profile`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setProfile({
          name: data.name || '',
          specialization: data.specialization || '',
          yearsOfExperience: data.yearsOfExperience || '',
          bio: data.bio || '',
          organization: data.organization || '',
          profilePicture: data.profilePicture || ''
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile');
        setLoading(false);
      });
  };

  useEffect(() => { fetchProfile(); }, []);

  // Handle form input
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Save profile to backend
  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      let pictureUrl = profile.profilePicture;
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const uploadRes = await fetch(`${API_BASE}/profile-picture`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        const uploadData = await uploadRes.json();
        pictureUrl = uploadData.url || pictureUrl;
      }
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, profilePicture: pictureUrl })
      });
      if (!res.ok) throw new Error('Failed to save profile');
      fetchProfile();
      setSuccess('Profile updated successfully!');
    } catch {
      setError('Failed to save profile');
    }
  };

  return (
    <div style={{ background: '#181028', minHeight: '100vh', padding: 40 }}>
      <h2 style={{ color: '#fff', marginBottom: 24 }}>Edit Profile</h2>
      {loading ? <div style={{ color: '#fff' }}>Loading...</div> : (
        <form onSubmit={handleSave} style={{ background: '#232042', borderRadius: 16, padding: 24, maxWidth: 420 }}>
          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            {profile.profilePicture && <img src={profile.profilePicture} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 8 }} />}
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#fff', display: 'block', marginBottom: 6 }}>Name</label>
            <input name="name" value={profile.name} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #444', background: '#181028', color: '#fff' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#fff', display: 'block', marginBottom: 6 }}>Specialization</label>
            <input name="specialization" value={profile.specialization} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #444', background: '#181028', color: '#fff' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#fff', display: 'block', marginBottom: 6 }}>Years of Experience</label>
            <input name="yearsOfExperience" value={profile.yearsOfExperience} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #444', background: '#181028', color: '#fff' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#fff', display: 'block', marginBottom: 6 }}>Organization</label>
            <input name="organization" value={profile.organization} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #444', background: '#181028', color: '#fff' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#fff', display: 'block', marginBottom: 6 }}>Bio</label>
            <textarea name="bio" value={profile.bio} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #444', background: '#181028', color: '#fff', minHeight: 60 }} />
          </div>
          <button type="submit" style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #F472B6 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Save</button>
          {error && <div style={{ color: '#F472B6', marginTop: 10 }}>{error}</div>}
          {success && <div style={{ color: '#10B981', marginTop: 10 }}>{success}</div>}
        </form>
      )}
    </div>
  );
};

export default MentorProfile;
