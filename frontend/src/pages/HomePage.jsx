import { useEffect, useRef } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import RecommendedProducts from "../components/RecommendedProducts";
import { motion } from "framer-motion";
import HeroCarousel from "../components/HeroCarousel";



const categories = [
	{ href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
	{ href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
	{ href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
	{ href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
	{ href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
	{ href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
	{ href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, fetchRecommendedProducts, products, recommendedProducts, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
		fetchRecommendedProducts();
	}, [fetchFeaturedProducts, fetchRecommendedProducts]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden bg-gray-900'>
			{/* Hero Section */}
			{/* Hero Section */}
			<div className='relative min-h-screen flex items-center justify-center overflow-hidden py-16 sm:py-0'>
				{/* Background decoration */}
				<div className='absolute inset-0 overflow-hidden'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15)_0%,rgba(0,0,0,0)_70%)]' />

					{/* Floating Particles */}
					{[...Array(20)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute bg-emerald-500/10 rounded-full"
							style={{
								top: `${Math.random() * 100}%`,
								left: `${Math.random() * 100}%`,
								width: `${Math.random() * 50 + 10}px`,
								height: `${Math.random() * 50 + 10}px`,
							}}
							animate={{
								y: [0, Math.random() * 100 - 50],
								x: [0, Math.random() * 100 - 50],
								opacity: [0.1, 0.3, 0.1],
							}}
							transition={{
								duration: Math.random() * 10 + 10,
								repeat: Infinity,
								ease: "linear",
							}}
						/>
					))}
				</div>

				<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between w-full h-full'>
					{/* Left Side: Content */}
					<div className='w-full sm:w-1/2 text-center sm:text-left mb-12 sm:mb-0 z-20'>
						<motion.h1
							className='text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 mb-6'
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
						>
							Elevate Your Style
						</motion.h1>

						<motion.p
							className='text-xl sm:text-2xl text-gray-300 mb-8 max-w-lg mx-auto sm:mx-0'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
						>
							Discover the latest trends in eco-friendly fashion with our premium collection.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.8, delay: 0.4 }}
						>
							<a
								href='#categories'
								className='inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/50'
							>
								Shop Now
							</a>
						</motion.div>
					</div>

					{/* Right Side: Carousel */}
					<div className='w-full sm:w-1/2 flex justify-center items-center z-20 relative'>
						{/* Add a subtle glow behind the carousel */}
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/10 blur-3xl rounded-full" />
						{!isLoading && products.length > 0 && (
							<motion.div
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.8, delay: 0.2 }}
							>
								<HeroCarousel products={products} />
							</motion.div>
						)}
					</div>
				</div>

				{/* Scrolling Benefits Marquee */}
				<div className="absolute bottom-0 left-0 w-full bg-emerald-900/20 backdrop-blur-sm py-4 overflow-hidden z-30 border-t border-emerald-500/10">
					<motion.div
						className="flex whitespace-nowrap"
						animate={{ x: ["0%", "-50%"] }}
						transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
					>
						{[...Array(2)].map((_, i) => (
							<div key={i} className="flex space-x-12 px-6">
								{[
									"Eco-Friendly Materials",
									"Sustainable Fashion",
									"Carbon Neutral Shipping",
									"Premium Quality",
									"Ethical Manufacturing",
									"24/7 Support",
									"Secure Payment"
								].map((text, idx) => (
									<span key={idx} className="text-emerald-300/80 font-medium text-lg flex items-center">
										<span className="w-2 h-2 bg-emerald-500 rounded-full mr-3" />
										{text}
									</span>
								))}
							</div>
						))}
					</motion.div>
				</div>
			</div>

			<div id='categories' className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<motion.div
					className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center'
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
				>
					<h2 className='text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-500 to-emerald-400 mb-6 drop-shadow-sm'>
						Curated Categories
					</h2>
					<p className='text-gray-300 text-lg max-w-2xl mx-auto'>
						Discover our hand-picked collections, designed to elevate your style with premium quality and modern aesthetics.
					</p>
					<div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto mt-6 rounded-full"></div>
				</motion.div>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4'>
					{categories.map((category, index) => (
						<motion.div
							key={category.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
							className={`relative overflow-hidden h-96 w-full rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 ${index === 0 || index === 1 || index === 5 || index === 6
								? 'lg:col-span-3'
								: 'lg:col-span-2'
								}`}
						>
							<div className="h-full w-full transform transition-transform duration-500 hover:scale-[1.01]">
								<CategoryItem category={category} />
							</div>
						</motion.div>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					viewport={{ once: true }}
					className='mt-24'
				>
					{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					viewport={{ once: true }}
					className='mt-16'
				>
					{!isLoading && recommendedProducts.length > 0 && <RecommendedProducts products={recommendedProducts} />}
				</motion.div>
			</div>
		</div>
	);
};
export default HomePage;
