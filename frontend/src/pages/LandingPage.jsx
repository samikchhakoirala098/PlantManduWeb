import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="relative h-screen flex items-center justify-center bg-green-900 text-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute top-1/2 -right-24 w-80 h-80 bg-green-500 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight">
                    Bring the <span className="text-green-400 italic">Wild</span> Home.
                </h1>
                <p className="text-xl md:text-2xl mb-10 text-green-100 font-medium">
                    Premium plants delivered to your doorstep. Transform your space with PlantMandu's curated collection of green wonders.
                </p>
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <Link
                        to="/plants"
                        className="px-10 py-5 bg-white text-green-900 text-xl font-bold rounded-full hover:bg-green-50 transform transition active:scale-95 shadow-2xl"
                    >
                        Explore Collection
                    </Link>
                    <Link
                        to="/register"
                        className="px-10 py-5 bg-transparent border-2 border-white text-white text-xl font-bold rounded-full hover:bg-white hover:text-green-900 transition transform active:scale-95"
                    >
                        Join Community
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
