import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import ItemCard from '../components/ItemCard';

export default function MyItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/items/mine')
            .then(res => setItems(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            await api.delete(`/items/${id}`);
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (err) {
            alert(err.response?.data?.error || 'Delete failed');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>My Items</h1>
                    <p>{items.length} item{items.length !== 1 ? 's' : ''} listed</p>
                </div>
                <Link to="/items/new" className="btn btn-primary">+ Post Item</Link>
            </div>

            {items.length === 0 ? (
                <div className="empty-state">
                    <span>📦</span>
                    <p>You haven't posted any items yet.</p>
                    <Link to="/items/new" className="btn btn-primary" style={{ marginTop: 12 }}>Post Your First Item</Link>
                </div>
            ) : (
                <div className="card-grid">
                    {items.map(item => (
                        <div key={item.id}>
                            <ItemCard item={item} />
                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                <Link to={`/items/${item.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
