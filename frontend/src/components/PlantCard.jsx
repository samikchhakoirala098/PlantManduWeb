import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const PlantCard = ({ plant }) => {
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
            <Link to={`/plants/${plant.id}`}>
                <img
                    src={plant.image ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${plant.image}` : 'https://placehold.co/400x300?text=Plant'}
                    alt={plant.name}
                    className="w-full h-48 object-cover"
                />
            </Link>
            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">{plant.name}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{plant.description}</p>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-extrabold text-green-600">${plant.price}</span>
                    {user?.role !== 'admin' && (
                        <button
                            onClick={() => addToCart(plant)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlantCard;
