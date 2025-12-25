import { useEffect, useState } from "react";

const HeroCarousel = ({ products }) => {
    // If no products, we can't show anything (or show placeholders if we had them)
    // For now, assuming products might be empty initially, so handle gracefully.

    // Use a subset of products for the carousel to keep it clean (e.g., top 4-6)
    const carouselProducts = products?.slice(0, 4) || [];

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (carouselProducts.length === 0) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % carouselProducts.length);
        }, 3000); // Rotate every 3 seconds

        return () => clearInterval(interval);
    }, [carouselProducts.length]);

    if (carouselProducts.length === 0) return null;

    return (
        <div className="relative w-full h-[400px] flex items-center justify-center perspective-1000">
            {carouselProducts.map((product, index) => {
                // Calculate position relative to active index
                const offset = (index - activeIndex + carouselProducts.length) % carouselProducts.length;

                // We want to show:
                // Active (0): Center, largest, z-index high
                // Next (1): Right, smaller, z-index lower
                // Previous (length-1): Left, smaller, z-index lower
                // Others: Hidden or very small/behind

                let style = {};
                let zIndex = 0;
                let opacity = 0;

                if (offset === 0) {
                    // Active Item
                    style = {
                        transform: "translateX(0) scale(1) translateZ(0)",
                        zIndex: 30,
                        opacity: 1,
                    };
                } else if (offset === 1) {
                    // Next Item
                    style = {
                        transform: "translateX(60%) scale(0.8) translateZ(-100px) rotateY(-15deg)",
                        zIndex: 20,
                        opacity: 0.7,
                    };
                } else if (offset === carouselProducts.length - 1) {
                    // Previous Item
                    style = {
                        transform: "translateX(-60%) scale(0.8) translateZ(-100px) rotateY(15deg)",
                        zIndex: 20,
                        opacity: 0.7,
                    };
                } else {
                    // Hidden/Behind
                    style = {
                        transform: "translateZ(-200px) scale(0.5)",
                        opacity: 0,
                        zIndex: 10,
                    };
                }

                return (
                    <div
                        key={product._id}
                        className="absolute transition-all duration-700 ease-in-out w-64 sm:w-80"
                        style={style}
                    >
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl relative overflow-hidden group">
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>

                            <div className="relative h-64 w-full rounded-xl overflow-hidden mb-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="text-white font-bold text-lg truncate">{product.name}</h3>
                                <p className="text-emerald-400 font-bold text-xl">₹{product.price.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Simple Indicators */}
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 flex space-x-2">
                {carouselProducts.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === activeIndex ? "bg-emerald-500 w-8" : "bg-gray-600 hover:bg-gray-500"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
