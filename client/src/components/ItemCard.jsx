import { Link } from 'react-router-dom';

export default function ItemCard({ item }) {
    const conditionLabel = item.condition?.replace('_', ' ');

    return (
        <div className="card item-card">
            <Link to={`/items/${item.id}`} className="item-card-title">
                {item.title}
            </Link>
            <div className="item-card-meta">
                <span className="badge badge-category">{item.category}</span>
                <span className="badge badge-condition">{conditionLabel}</span>
                <span className={`badge badge-status-${item.status}`}>{item.status}</span>
            </div>
            {item.description && (
                <p className="item-card-desc">
                    {item.description.length > 100 ? item.description.slice(0, 100) + '…' : item.description}
                </p>
            )}
            {item.owner && (
                <p style={{ fontSize: '0.8rem', color: '#888' }}>
                    by {item.owner.name}{item.owner.city ? ` • ${item.owner.city}` : ''}
                </p>
            )}
        </div>
    );
}
