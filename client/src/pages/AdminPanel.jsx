import { useState, useEffect } from 'react';
import api from '../api/client';

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            api.get('/users'),
            api.get('/users/stats')
        ])
            .then(([usersRes, statsRes]) => {
                setUsers(usersRes.data);
                setStats(statsRes.data);
            })
            .catch(() => setError('Failed to load admin data'))
            .finally(() => setLoading(false));
    }, []);

    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Delete user "${name}" and all their items/swaps?`)) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err) {
            alert(err.response?.data?.error || 'Delete failed');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div>
            <div className="page-header">
                <h1>Admin Panel</h1>
                <p>Platform management</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {stats && (
                <div className="stats-grid">
                    <div className="card stat-card">
                        <div className="stat-number">{stats.users}</div>
                        <div className="stat-label">Users</div>
                    </div>
                    <div className="card stat-card">
                        <div className="stat-number">{stats.items}</div>
                        <div className="stat-label">Items</div>
                    </div>
                    <div className="card stat-card">
                        <div className="stat-number">{stats.completedSwaps}</div>
                        <div className="stat-label">Completed Swaps</div>
                    </div>
                </div>
            )}

            <h2 style={{ marginBottom: 8 }}>Users ({users.length})</h2>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>City</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.city || '—'}</td>
                            <td>
                                <span className={`badge ${user.isAdmin ? 'badge-status-accepted' : 'badge-category'}`}>
                                    {user.isAdmin ? 'Admin' : 'User'}
                                </span>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                {!user.isAdmin && (
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteUser(user.id, user.name)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
