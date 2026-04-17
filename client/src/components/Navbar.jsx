import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <span>♻️</span> EcoSwap
                </Link>
                <div className="navbar-links">
                    <Link to="/items" className={isActive('/items')}>Browse</Link>
                    {user ? (
                        <>
                            <Link to="/items/new" className={isActive('/items/new')}>Post Item</Link>
                            <Link to="/my-items" className={isActive('/my-items')}>My Items</Link>
                            <Link to="/my-swaps" className={isActive('/my-swaps')}>Swaps</Link>
                            <Link to="/profile" className={isActive('/profile')}>Profile</Link>
                            {user.isAdmin && (
                                <Link to="/admin" className={isActive('/admin')}>Admin</Link>
                            )}
                            <button onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={isActive('/login')}>Login</Link>
                            <Link to="/register" className={isActive('/register')}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
