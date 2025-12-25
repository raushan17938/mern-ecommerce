import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";

const SearchPage = () => {
    const { fetchProductsByFilter, products, loading } = useProductStore();
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";

    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    useEffect(() => {
        fetchProductsByFilter({ search, category, minPrice, maxPrice, sortBy });
    }, [fetchProductsByFilter, search, category, minPrice, maxPrice, sortBy]);

    useEffect(() => {
        // Reset filters when search term changes
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
        setSortBy("newest");
    }, [search]);

    const handleCategoryChange = (e) => setCategory(e.target.value);
    const handleMinPriceChange = (e) => setMinPrice(e.target.value);
    const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);
    const handleSortChange = (e) => setSortBy(e.target.value);

    const toggleFilters = () => setIsFiltersOpen(!isFiltersOpen);

    return (
        <div className='min-h-screen bg-gray-900 text-white pt-20 pb-10'>
            <div className='container mx-auto px-4'>
                <h1 className='text-3xl font-bold mb-8 text-center text-emerald-400'>
                    {search ? `Search Results for "${search}"` : "All Products"}
                </h1>

                {/* Mobile Filter Toggle */}
                <div className='md:hidden mb-4'>
                    <button
                        type='button'
                        onClick={toggleFilters}
                        className='w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors'
                    >
                        <Filter size={20} />
                        {isFiltersOpen ? "Hide Filters" : "Show Filters"}
                    </button>
                </div>

                <div className='flex flex-col md:flex-row gap-8'>
                    {/* Sidebar Filters */}
                    <div
                        className={`w-full md:w-1/4 bg-gray-800 p-6 rounded-lg shadow-lg h-fit ${isFiltersOpen ? "block" : "hidden"
                            } md:block`}
                    >
                        <h2 className='text-xl font-semibold mb-4 text-emerald-300 flex items-center gap-2'>
                            <Search size={20} /> Filters
                        </h2>

                        <div className='mb-4'>
                            <label className='block text-gray-400 mb-2'>Category</label>
                            <select
                                value={category}
                                onChange={handleCategoryChange}
                                className='w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500'
                            >
                                <option value=''>All Categories</option>
                                <option value='jeans'>Jeans</option>
                                <option value='t-shirts'>T-shirts</option>
                                <option value='shoes'>Shoes</option>
                                <option value='glasses'>Glasses</option>
                                <option value='jackets'>Jackets</option>
                                <option value='suits'>Suits</option>
                                <option value='bags'>Bags</option>
                            </select>
                        </div>

                        <div className='mb-4'>
                            <label className='block text-gray-400 mb-2'>Price Range</label>
                            <div className='flex gap-2'>
                                <input
                                    type='number'
                                    placeholder='Min'
                                    value={minPrice}
                                    onChange={handleMinPriceChange}
                                    className='w-1/2 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                />
                                <input
                                    type='number'
                                    placeholder='Max'
                                    value={maxPrice}
                                    onChange={handleMaxPriceChange}
                                    className='w-1/2 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                />
                            </div>
                        </div>

                        <div className='mb-4'>
                            <label className='block text-gray-400 mb-2'>Sort By</label>
                            <select
                                value={sortBy}
                                onChange={handleSortChange}
                                className='w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500'
                            >
                                <option value='newest'>Newest</option>
                                <option value='price_asc'>Price: Low to High</option>
                                <option value='price_desc'>Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className='w-full md:w-3/4'>
                        {loading ? (
                            <div className='flex justify-center items-center h-64'>
                                <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500'></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className='text-center text-gray-400 py-10'>
                                <p className='text-xl'>No products found matching your criteria.</p>
                            </div>
                        ) : (
                            <motion.div
                                className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
