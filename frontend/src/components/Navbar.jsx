import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    return (
        <nav className="bg-green-700 text-white p-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tighter hover:text-green-200 transition">
                    PlantMandu
                </Link>
                <div className="flex gap-6 items-center">
                    <Link to="/plants" className="hover:text-green-200">Shop</Link>
                    {user?.role !== 'admin' && (
                        <Link to="/cart" className="relative hover:text-green-200">
                            Cart
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                    )}
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="bg-green-800 px-3 py-1 rounded hover:bg-green-900">Admin</Link>
                            )}
                            <button
                                onClick={() => { clearCart(); logout(); navigate('/'); }}
                                className="hover:text-green-200 font-semibold"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="hover:text-green-200">Login</Link>
                            <Link to="/register" className="bg-white text-green-700 px-4 py-1 rounded-full font-bold hover:bg-green-100 transition">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
