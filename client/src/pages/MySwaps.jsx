import { useState, useEffect } from 'react';
import api from '../api/client';
import SwapRequestCard from '../components/SwapRequestCard';

export default function MySwaps() {
    const [swaps, setSwaps] = useState({ sent: [], received: [] });
    const [tab, setTab] = useState('received');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSwaps = () => {
        setLoading(true);
        api.get('/swaps/mine')
            .then(res => setSwaps(res.data))
            .catch(() => setError('Failed to load swaps'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchSwaps(); }, []);

    const handleAccept = async (id) => {
        try {
            await api.patch(`/swaps/${id}`, { status: 'accepted' });
            fetchSwaps();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to accept swap');
        }
    };

    const handleReject = async (id) => {
        try {
            await api.patch(`/swaps/${id}`, { status: 'rejected' });
            fetchSwaps();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to reject swap');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    const currentSwaps = tab === 'received' ? swaps.received : swaps.sent;
    const pendingCount = swaps.received.filter(s => s.status === 'pending').length;

    return (
        <div>
            <div className="page-header">
                <h1>My Swaps</h1>
                <p>Manage your swap requests</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="tabs">
                <button className={`tab ${tab === 'received' ? 'active' : ''}`} onClick={() => setTab('received')}>
                    Received {pendingCount > 0 && `(${pendingCount})`}
                </button>
                <button className={`tab ${tab === 'sent' ? 'active' : ''}`} onClick={() => setTab('sent')}>
                    Sent ({swaps.sent.length})
                </button>
            </div>

            {currentSwaps.length === 0 ? (
                <div className="empty-state">
                    <span>🔄</span>
                    <p>No {tab} swap requests yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {currentSwaps.map(swap => (
                        <SwapRequestCard
                            key={swap.id}
                            swap={swap}
                            type={tab}
                            onAccept={handleAccept}
                            onReject={handleReject}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
