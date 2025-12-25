import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CategoryItem = ({ category }) => {
	return (
		<div className='relative overflow-hidden h-full w-full rounded-lg group cursor-pointer'>
			<Link to={"/category" + category.href}>
				<div className='w-full h-full cursor-pointer'>
					{/* Background Image with Zoom Effect */}
					<div className='absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10' />
					<img
						src={category.imageUrl}
						alt={category.name}
						className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
						loading='lazy'
					/>

					{/* Content with Reveal Effect */}
					<div className='absolute bottom-0 left-0 right-0 p-4 z-20 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0'>
						<h3 className='text-white text-2xl font-bold mb-2 group-hover:text-emerald-400 transition-colors'>{category.name}</h3>
						<p className='text-gray-200 text-sm mb-2'>Explore {category.name}</p>

						{/* Hidden 'Explore' button/indicator that reveals on hover */}
						<div className="overflow-hidden h-0 group-hover:h-8 transition-all duration-300 opacity-0 group-hover:opacity-100">
							<span className="text-emerald-300 font-medium text-sm flex items-center">
								Shop Now <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
							</span>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default CategoryItem;
