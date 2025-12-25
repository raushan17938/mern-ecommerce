import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Search, Menu, X, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useState } from "react";
import VoiceSearchBar from "./VoiceSearchBar";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();
	const [searchTerm, setSearchTerm] = useState("");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchTerm.trim()) {
			navigate(`/search?search=${searchTerm}`);
			setIsMobileMenuOpen(false);
		}
	};

	const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

	return (
		<header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex flex-wrap justify-between items-center'>
					<Link to='/' className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>
						SecureShop
					</Link>

					{/* Desktop Search */}
					<div className='flex-grow max-w-md mx-4 hidden sm:flex items-center relative'>
						<form onSubmit={handleSearch} className='w-full'>
							<div className='relative w-full'>
								<input
									type='text'
									placeholder='Search products...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='w-full bg-gray-800 text-white border border-gray-700 rounded-full py-2 px-4 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
								/>
								<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
							</div>
						</form>
						<div className='absolute right-2 top-1'>
							<VoiceSearchBar />
						</div>
					</div>

					{/* Mobile Menu Button */}
					<button
						className='sm:hidden text-gray-300 hover:text-emerald-400 focus:outline-none'
						onClick={toggleMobileMenu}
					>
						{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>

					{/* Desktop Navigation */}
					<nav className='hidden sm:flex flex-wrap items-center gap-4'>
						<Link
							to={"/"}
							className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
						>
							Home
						</Link>
						{user && (
							<Link
								to={"/cart"}
								className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
							>
								<ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
								<span className='hidden sm:inline'>Cart</span>
								{cart.length > 0 && (
									<span
										className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}
						{isAdmin && (
							<Link
								className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center'
								to={"/secret-dashboard"}
							>
								<Lock className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Dashboard</span>
							</Link>
						)}

						{user ? (
							<div className='flex items-center gap-4'>
								<Link
									to={"/profile"}
									className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
								>
									<User size={20} className='mr-1' />
									<span className='hidden sm:inline'>Profile</span>
								</Link>
								<button
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
						rounded-md flex items-center transition duration-300 ease-in-out'
									onClick={logout}
								>
									<LogOut size={18} />
									<span className='hidden sm:inline ml-2'>Log Out</span>
								</button>
							</div>
						) : (
							<>
								<Link
									to={"/signup"}
									className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<UserPlus className='mr-2' size={18} />
									Sign Up
								</Link>
								<Link
									to={"/login"}
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<LogIn className='mr-2' size={18} />
									Login
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className='sm:hidden bg-gray-900 border-t border-emerald-800'>
					<div className='px-4 pt-2 pb-4 space-y-1'>
						{/* Mobile Search */}
						<form onSubmit={handleSearch} className='mb-4'>
							<div className='relative w-full'>
								<input
									type='text'
									placeholder='Search products...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='w-full bg-gray-800 text-white border border-gray-700 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
								/>
								<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
							</div>
						</form>

						<Link
							to={"/"}
							className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-emerald-400 hover:bg-gray-800'
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Home
						</Link>
						{user && (
							<Link
								to={"/cart"}
								className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-emerald-400 hover:bg-gray-800'
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<ShoppingCart className='inline-block mr-1' size={20} />
								Cart ({cart.length})
							</Link>
						)}
						{isAdmin && (
							<Link
								to={"/secret-dashboard"}
								className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-emerald-400 hover:bg-gray-800'
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<Lock className='inline-block mr-1' size={18} />
								Dashboard
							</Link>
						)}
						{user ? (
							<button
								className='block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-emerald-400 hover:bg-gray-800'
								onClick={() => {
									logout();
									setIsMobileMenuOpen(false);
								}}
							>
								<LogOut className='inline-block mr-1' size={18} />
								Log Out
							</button>
						) : (
							<>
								<Link
									to={"/signup"}
									className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-emerald-400 hover:bg-gray-800'
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<UserPlus className='inline-block mr-1' size={18} />
									Sign Up
								</Link>
								<Link
									to={"/login"}
									className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-emerald-400 hover:bg-gray-800'
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<LogIn className='inline-block mr-1' size={18} />
									Login
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</header>
	);
};
export default Navbar;
