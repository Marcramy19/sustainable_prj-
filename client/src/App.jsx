import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ItemList from './pages/ItemList';
import ItemDetail from './pages/ItemDetail';
import ItemForm from './pages/ItemForm';
import MyItems from './pages/MyItems';
import MySwaps from './pages/MySwaps';
import AdminPanel from './pages/AdminPanel';

export default function App() {
    return (
        <>
            <Navbar />
            <main className="container page">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/items" element={<ItemList />} />
                    <Route path="/items/:id" element={<ItemDetail />} />
                    <Route path="/items/new" element={<ProtectedRoute><ItemForm /></ProtectedRoute>} />
                    <Route path="/items/:id/edit" element={<ProtectedRoute><ItemForm /></ProtectedRoute>} />
                    <Route path="/my-items" element={<ProtectedRoute><MyItems /></ProtectedRoute>} />
                    <Route path="/my-swaps" element={<ProtectedRoute><MySwaps /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
                </Routes>
            </main>
        </>
    );
}
