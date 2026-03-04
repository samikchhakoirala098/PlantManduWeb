import { useState, useEffect } from 'react';
import axios from 'axios';
import PlantCard from '../components/PlantCard';

const ProductFeed = () => {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/plants`);
                setPlants(res.data);
            } catch (error) {
                console.error('Error fetching plants', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlants();
    }, []);

    if (loading) return (
        <div className="h-[80vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-12">
            <header className="mb-12">
                <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Our Collection</h1>
                <p className="text-gray-500 font-medium text-lg">Hand-picked greenery for your space.</p>
            </header>

            {plants.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-xl text-gray-400 font-medium tracking-tight">No plants found. Check back later!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {plants.map(plant => (
                        <PlantCard key={plant.id} plant={plant} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductFeed;
