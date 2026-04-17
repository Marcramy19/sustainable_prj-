import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';

const CATEGORIES = ['electronics', 'books', 'clothing', 'furniture', 'sports', 'toys', 'kitchen', 'other'];
const CONDITIONS = ['new', 'like_new', 'good', 'fair'];

export default function ItemForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            api.get(`/items/${id}`)
                .then(res => {
                    setTitle(res.data.title);
                    setDescription(res.data.description || '');
                    setCategory(res.data.category);
                    setCondition(res.data.condition);
                })
                .catch(() => setError('Item not found'));
        }
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = { title, description, category, condition };
            if (isEdit) {
                await api.put(`/items/${id}`, data);
                navigate(`/items/${id}`);
            } else {
                const res = await api.post('/items', data);
                navigate(`/items/${res.data.id}`);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>{isEdit ? 'Edit Item' : 'Post New Item'}</h1>
            </div>
            <div className="card" style={{ maxWidth: 600 }}>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required maxLength={200} placeholder="e.g. Python Programming Book" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} maxLength={1000} placeholder="Describe the item, its condition, why you want to swap it..." />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category *</label>
                        <select id="category" value={category} onChange={e => setCategory(e.target.value)} required>
                            <option value="">Select a category</option>
                            {CATEGORIES.map(c => (
                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="condition">Condition *</label>
                        <select id="condition" value={condition} onChange={e => setCondition(e.target.value)} required>
                            <option value="">Select condition</option>
                            {CONDITIONS.map(c => (
                                <option key={c} value={c}>{c.replace('_', ' ').charAt(0).toUpperCase() + c.replace('_', ' ').slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : isEdit ? 'Update Item' : 'Post Item'}
                    </button>
                </form>
            </div>
        </div>
    );
}
