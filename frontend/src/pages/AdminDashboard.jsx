import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [plants, setPlants] = useState([]);
    const [orders, setOrders] = useState([]);
    const [view, setView] = useState('plants'); // 'plants' or 'orders'

    // Plant form state
    const [formData, setFormData] = useState({ name: '', price: '', description: '', category: '' });
    const [file, setFile] = useState(null);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchPlants();
            fetchOrders();
        }
    }, [user]);

    const fetchPlants = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/plants`);
        setPlants(res.data);
    };

    const fetchOrders = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrders(res.data);
    };

    const handlePlantSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('category', formData.category);
        if (file) data.append('image', file);

        try {
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_API_URL}/plants/${editingId}`, data, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                toast.success('Plant updated');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/plants`, data, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                toast.success('Plant added');
            }
            setFormData({ name: '', price: '', description: '', category: '' });
            setFile(null);
            setEditingId(null);
            fetchPlants();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await axios.delete(`${import.meta.env.VITE_API_URL}/plants/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Plant deleted');
            fetchPlants();
        }
    };

    const handleConfirmOrder = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/orders/${id}/confirm`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Order confirmed');
            fetchOrders();
        } catch (error) {
            toast.error('Confirmation failed');
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="h-screen flex items-center justify-center">
                <h1 className="text-3xl font-black text-red-500">Access Denied</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black tracking-tight">Admin Dashboard</h1>
                <div className="bg-gray-200 p-1 rounded-xl flex gap-1 font-bold">
                    <button
                        onClick={() => setView('plants')}
                        className={`px-6 py-2 rounded-lg transition ${view === 'plants' ? 'bg-white shadow-sm text-green-700' : 'text-gray-500'}`}
                    >
                        Plants
                    </button>
                    <button
                        onClick={() => setView('orders')}
                        className={`px-6 py-2 rounded-lg transition ${view === 'orders' ? 'bg-white shadow-sm text-green-700' : 'text-gray-500'}`}
                    >
                        Orders
                    </button>
                </div>
            </div>

            {view === 'plants' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Plant Form */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 h-fit sticky top-24">
                        <h2 className="text-2xl font-black mb-6">{editingId ? 'Edit Plant' : 'Add New Plant'}</h2>
                        <form onSubmit={handlePlantSubmit} className="space-y-4">
                            <input
                                type="text" placeholder="Plant Name" required
                                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                type="number" placeholder="Price" required
                                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                                value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                            <textarea
                                placeholder="Description" required rows="4"
                                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                                value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <input
                                type="file" onChange={(e) => setFile(e.target.files[0])}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            />
                            <button className="w-full bg-green-600 text-white font-black py-4 rounded-xl hover:bg-green-700 shadow-xl shadow-green-100 transition active:scale-[0.98]">
                                {editingId ? 'Update Plant' : 'Add Plant'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', price: '', description: '', category: '' }); }} className="w-full text-gray-500 font-bold">
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Plant List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-2xl font-black mb-6">Manage Plants</h2>
                        {plants.map(plant => (
                            <div key={plant.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition">
                                <img src={plant.image ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${plant.image}` : 'https://placehold.co/80x80'} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-gray-900">{plant.name}</h3>
                                    <p className="text-green-600 font-bold">${plant.price}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setEditingId(plant.id); setFormData(plant); }}
                                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(plant.id)}
                                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <h2 className="text-2xl font-black mb-6">Customer Orders</h2>
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Customer Email</p>
                                    <p className="text-sm font-bold text-gray-900">{order.User?.email}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Username</p>
                                    <p className="text-sm font-bold text-gray-900">{order.User?.username}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4 mb-6">
                                {order.OrderItems?.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                                        <img
                                            src={item.Plant?.image ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${item.Plant.image}` : 'https://placehold.co/50x50'}
                                            className="w-12 h-12 rounded-lg object-cover"
                                            alt=""
                                        />
                                        <div className="flex-1 flex justify-between text-sm font-medium">
                                            <span className="text-gray-900 font-bold">{item.Plant?.name || 'Unknown Plant'} x {item.quantity}</span>
                                            <span className="font-extrabold text-blue-600">${item.price * item.quantity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                                <p className="text-2xl font-black text-gray-900">Total: ${order.totalAmount}</p>
                                {order.status === 'pending' && (
                                    <button
                                        onClick={() => handleConfirmOrder(order.id)}
                                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-black hover:bg-green-700 transition shadow-lg shadow-green-100 active:scale-95"
                                    >
                                        Confirm Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && <p className="text-center text-gray-400 font-bold py-12">No orders found.</p>}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
