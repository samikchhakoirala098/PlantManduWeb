import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plant, setPlant] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPlant = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/plants/${id}`);
                setPlant(res.data);
            } catch (error) {
                toast.error('Plant not found');
                navigate('/plants');
            } finally {
                setLoading(false);
            }
        };
        fetchPlant();
    }, [id, navigate]);

    if (loading) return (
        <div className="h-[80vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
                <div className="md:w-1/2">
                    <img
                        src={plant.image ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${plant.image}` : 'https://placehold.co/800x600?text=Plant'}
                        className="w-full h-[500px] object-cover"
                        alt={plant.name}
                    />
                </div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <span className="bg-green-100 text-green-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
                            Premium Breed
                        </span>
                        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">{plant.name}</h1>
                        <p className="text-3xl font-extrabold text-green-600 mb-6">${plant.price}</p>
                        <div className="h-1 w-20 bg-green-500 rounded-full mb-8"></div>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            {plant.description}
                        </p>
                    </div>

                    {user?.role !== 'admin' && (
                        <div className="mt-auto pt-8 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    addToCart(plant);
                                    toast.success('Added to cart!');
                                }}
                                className="w-full md:w-auto px-12 py-5 bg-green-600 text-white text-xl font-bold rounded-2xl hover:bg-green-700 transition shadow-xl shadow-green-100 transform active:scale-95"
                            >
                                Add to Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
