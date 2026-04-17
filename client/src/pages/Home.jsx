import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user } = useAuth();

    return (
        <div>
            <section className="hero">
                <h1>Swap, Don't Shop</h1>
                <p>Exchange your unused items with your community. No money, no waste — just swaps.</p>
                <div className="hero-actions">
                    <Link to="/items" className="btn btn-primary">Browse Items</Link>
                    {!user && <Link to="/register" className="btn btn-outline">Get Started</Link>}
                    {user && <Link to="/items/new" className="btn btn-secondary">Post an Item</Link>}
                </div>
            </section>

            <section className="features">
                <div className="card feature-card">
                    <div className="feature-icon">📦</div>
                    <h3>List Items</h3>
                    <p>Post items you no longer need. Describe them, set the condition, and wait for offers.</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">🔄</div>
                    <h3>Propose Swaps</h3>
                    <p>See something you like? Offer one of your items in exchange — no money involved.</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">🌱</div>
                    <h3>Reduce Waste</h3>
                    <p>Every swap keeps items out of landfills. Small actions, big impact.</p>
                </div>
            </section>
        </div>
    );
}
