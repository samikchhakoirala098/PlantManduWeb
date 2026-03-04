import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        if (!user) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }

        try {
            const orderData = {
                items: cart.map(item => ({
                    plantId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: total,
                address: 'User default address' // In a real app, this would come from a form
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            toast.success('Order placed successfully! Pending admin confirmation.');
            clearCart();
            navigate('/plants');
        } catch (error) {
            toast.error('Checkout failed');
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-black mb-12 tracking-tight">Your Cart</h1>

            {cart.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-xl text-gray-400 font-medium tracking-tight mb-8">Your cart is empty.</p>
                    <button
                        onClick={() => navigate('/plants')}
                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition"
                    >
                        Go Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                                <img
                                    src={item.image ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${item.image}` : 'https://placehold.co/100x100?text=Plant'}
                                    className="w-24 h-24 object-cover rounded-xl shadow-md"
                                    alt={item.name}
                                />
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                                    <p className="text-green-600 font-bold">${item.price} x {item.quantity}</p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 font-bold px-4"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-2xl h-fit border border-gray-100">
                        <h2 className="text-2xl font-black mb-6">Summary</h2>
                        <div className="flex justify-between mb-4 font-medium text-gray-600">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-8 pb-6 border-b border-gray-100 text-2xl font-black text-gray-900">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-green-700 shadow-xl shadow-green-100 transition active:scale-[0.98]"
                        >
                            Checkout Now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
