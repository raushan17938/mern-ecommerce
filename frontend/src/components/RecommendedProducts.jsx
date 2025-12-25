import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

const RecommendedProducts = ({ products }) => {
    return (
        <div className='py-16'>
            <div className='container mx-auto px-4'>
                <motion.h2
                    className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-12'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Recommended For You
                </motion.h2>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecommendedProducts;
