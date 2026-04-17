import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function Profile() {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [city, setCity] = useState(user?.city || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const res = await api.put('/users/me', { name, city, bio });
            updateUser(res.data);
            setSuccess('Profile updated successfully');
        } catch (err) {
            setError(err.response?.data?.error || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action is irreversible.')) return;
        try {
            await api.delete('/users/me');
            logout();
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Deletion failed');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>My Profile</h1>
            </div>
            <div className="card profile-card">
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input id="city" type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Paris" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell others about yourself..." />
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
                        <button className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={handleDelete}>
                            Delete Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
