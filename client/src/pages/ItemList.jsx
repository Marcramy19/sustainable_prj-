import { useState, useEffect } from 'react';
import api from '../api/client';
import ItemCard from '../components/ItemCard';

const CATEGORIES = ['all', 'electronics', 'books', 'clothing', 'furniture', 'sports', 'toys', 'kitchen', 'other'];

export default function ItemList() {
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const params = { page };
        if (category !== 'all') params.category = category;

        api.get('/items', { params })
            .then(res => {
                setItems(res.data.items);
                setTotalPages(res.data.totalPages);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [category, page]);

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setPage(1);
    };

    return (
        <div>
            <div className="page-header">
                <h1>Browse Items</h1>
                <p>Find something you need — offer something you don't</p>
            </div>

            <div className="filters">
                <select value={category} onChange={handleCategoryChange} id="category-filter">
                    {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="loading">Loading items...</div>
            ) : items.length === 0 ? (
                <div className="empty-state">
                    <span>📭</span>
                    <p>No items found. Be the first to post one!</p>
                </div>
            ) : (
                <>
                    <div className="card-grid">
                        {items.map(item => <ItemCard key={item.id} item={item} />)}
                    </div>
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button className="btn btn-sm btn-outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                            <span style={{ padding: '6px 12px', fontSize: '0.875rem' }}>Page {page} of {totalPages}</span>
                            <button className="btn btn-sm btn-outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
