export default function SwapRequestCard({ swap, type, onAccept, onReject }) {
    const isReceived = type === 'received';

    return (
        <div className="card swap-card">
            <div className="swap-card-items">
                <div className="swap-card-item">
                    <div className="item-name">{swap.offeredItem.title}</div>
                    {swap.offeredItem.owner && (
                        <div className="owner-name">by {swap.offeredItem.owner.name}</div>
                    )}
                    <span className="badge badge-category" style={{ marginTop: 4 }}>{swap.offeredItem.category}</span>
                </div>
                <div className="swap-arrow">⇄</div>
                <div className="swap-card-item">
                    <div className="item-name">{swap.requestedItem.title}</div>
                    {swap.requestedItem.owner && (
                        <div className="owner-name">by {swap.requestedItem.owner.name}</div>
                    )}
                    <span className="badge badge-category" style={{ marginTop: 4 }}>{swap.requestedItem.category}</span>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`badge badge-status-${swap.status}`}>{swap.status}</span>
                {isReceived && swap.status === 'pending' && (
                    <div className="swap-actions">
                        <button className="btn btn-success btn-sm" onClick={() => onAccept(swap.id)}>Accept</button>
                        <button className="btn btn-danger btn-sm" onClick={() => onReject(swap.id)}>Reject</button>
                    </div>
                )}
            </div>
        </div>
    );
}
