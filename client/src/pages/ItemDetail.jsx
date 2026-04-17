import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function ItemDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Swap modal state
    const [showSwapModal, setShowSwapModal] = useState(false);
    const [myItems, setMyItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [swapLoading, setSwapLoading] = useState(false);
    const [swapSuccess, setSwapSuccess] = useState('');
    const [swapError, setSwapError] = useState('');

    useEffect(() => {
        api.get(`/items/${id}`)
            .then(res => setItem(res.data))
            .catch(() => setError('Item not found'))
            .finally(() => setLoading(false));
    }, [id]);

    const openSwapModal = async () => {
        try {
            const res = await api.get('/items/mine');
            const available = res.data.filter(i => i.status === 'available');
            setMyItems(available);
            setShowSwapModal(true);
        } catch {
            setSwapError('Failed to load your items');
        }
    };

    const submitSwap = async () => {
        if (!selectedItemId) return;
        setSwapLoading(true);
        setSwapError('');
        try {
            await api.post('/swaps', { offeredItemId: selectedItemId, requestedItemId: id });
            setSwapSuccess('Swap request sent!');
            setShowSwapModal(false);
        } catch (err) {
            setSwapError(err.response?.data?.error || 'Failed to send swap request');
        } finally {
            setSwapLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this item?')) return;
        try {
            await api.delete(`/items/${id}`);
            navigate('/my-items');
        } catch (err) {
            setError(err.response?.data?.error || 'Delete failed');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="alert alert-error">{error}</div>;
    if (!item) return null;

    const isOwner = user && user.id === item.owner?.id;
    const isAdmin = user && user.isAdmin;
    const conditionLabel = item.condition?.replace('_', ' ');

    return (
        <div className="detail-page">
            <Link to="/items" style={{ fontSize: '0.875rem', marginBottom: 16, display: 'inline-block' }}>← Back to items</Link>

            <h1>{item.title}</h1>
            <div className="detail-meta">
                <span className="badge badge-category">{item.category}</span>
                <span className="badge badge-condition">{conditionLabel}</span>
                <span className={`badge badge-status-${item.status}`}>{item.status}</span>
            </div>

            {item.description && <p className="detail-description">{item.description}</p>}

            {item.owner && (
                <div className="detail-owner">
                    <strong>Posted by:</strong> {item.owner.name}
                    {item.owner.city && <span> • {item.owner.city}</span>}
                </div>
            )}

            {swapSuccess && <div className="alert alert-success">{swapSuccess}</div>}
            {swapError && <div className="alert alert-error">{swapError}</div>}

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                {user && !isOwner && item.status === 'available' && (
                    <button className="btn btn-primary" onClick={openSwapModal}>🔄 Propose Swap</button>
                )}
                {isOwner && (
                    <>
                        <Link to={`/items/${id}/edit`} className="btn btn-secondary">Edit</Link>
                        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                    </>
                )}
                {!isOwner && isAdmin && (
                    <button className="btn btn-danger btn-sm" onClick={handleDelete}>Admin Delete</button>
                )}
            </div>

            {/* Swap Modal */}
            {showSwapModal && (
                <div className="modal-overlay" onClick={() => setShowSwapModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Select an Item to Offer</h2>
                        {myItems.length === 0 ? (
                            <p style={{ color: '#888' }}>
                                You have no available items. <Link to="/items/new">Post one first</Link>.
                            </p>
                        ) : (
                            <>
                                {myItems.map(mi => (
                                    <div
                                        key={mi.id}
                                        className={`modal-item ${selectedItemId === mi.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedItemId(mi.id)}
                                    >
                                        <strong>{mi.title}</strong>
                                        <span className="badge badge-category" style={{ marginLeft: 8 }}>{mi.category}</span>
                                    </div>
                                ))}
                                <div className="modal-actions">
                                    <button className="btn btn-outline btn-sm" onClick={() => setShowSwapModal(false)}>Cancel</button>
                                    <button className="btn btn-primary btn-sm" onClick={submitSwap} disabled={!selectedItemId || swapLoading}>
                                        {swapLoading ? 'Sending...' : 'Send Swap Request'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
