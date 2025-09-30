import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	return (
		<header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex flex-wrap justify-between items-center'>
					<Link to='/' className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>
						E-Commerce
					</Link>

					{/* Mobile hamburger */}
					<button
						className='md:hidden text-gray-200 hover:text-emerald-400 transition'
						aria-label='Toggle menu'
						onClick={() => setIsMobileOpen((prev) => !prev)}
					>
						{isMobileOpen ? <X size={28} /> : <Menu size={28} />}
					</button>

					<nav className='hidden md:flex flex-wrap items-center gap-4'>
						<Link
							to={"/"}
							className='text-gray-300 hover:text-emerald-400 transition duration-300
					 ease-in-out'
						>
							Home
						</Link>
						{user && (
							<Link
								to={"/cart"}
								className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 
							ease-in-out'
							>
								<ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
								<span className='hidden sm:inline'>Cart</span>
								{cart.length > 0 && (
									<span
										className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}
						{isAdmin && (
							<Link
								className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center'
								to={"/secret-dashboard"}
							>
								<Lock className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Dashboard</span>
							</Link>
						)}

						{user ? (
							<button
								className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
						rounded-md flex items-center transition duration-300 ease-in-out'
								onClick={logout}
							>
								<LogOut size={18} />
								<span className='hidden sm:inline ml-2'>Log Out</span>
							</button>
						) : (
							<>
								<Link
									to={"/signup"}
									className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<UserPlus className='mr-2' size={18} />
									Sign Up
								</Link>
								<Link
									to={"/login"}
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<LogIn className='mr-2' size={18} />
									Login
								</Link>
							</>
						)}
					</nav>

					{isMobileOpen && (
						<div className='md:hidden w-full mt-3'>
							<div className='bg-gray-800 border border-gray-700 rounded-lg p-3 flex flex-col gap-2 shadow-xl'>
								<Link
									to={'/'}
									className='text-gray-200 hover:text-emerald-400 py-2 rounded-md'
									onClick={() => setIsMobileOpen(false)}
								>
									Home
								</Link>
								{user && (
									<Link
										to={'/cart'}
										className='text-gray-200 hover:text-emerald-400 py-2 rounded-md flex items-center'
										onClick={() => setIsMobileOpen(false)}
									>
										<ShoppingCart className='mr-2' size={18} />
										Cart
										{cart.length > 0 && (
											<span className='ml-auto bg-emerald-600 text-white rounded-full px-2 text-xs'>
												{cart.length}
											</span>
										)}
									</Link>
								)}
								{isAdmin && (
									<Link
										to={'/secret-dashboard'}
										className='text-gray-200 hover:text-emerald-400 py-2 rounded-md flex items-center'
										onClick={() => setIsMobileOpen(false)}
									>
										<Lock className='mr-2' size={18} />
										Dashboard
									</Link>
								)}
								{user ? (
									<button
										className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center justify-center'
										onClick={() => {
											setIsMobileOpen(false);
											logout();
										}}
									>
										<LogOut className='mr-2' size={18} />
										Log Out
									</button>
								) : (
									<div className='flex flex-col gap-2'>
										<Link
											to={'/signup'}
											className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center justify-center'
											onClick={() => setIsMobileOpen(false)}
										>
											<UserPlus className='mr-2' size={18} />
											Sign Up
										</Link>
										<Link
											to={'/login'}
											className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center justify-center'
											onClick={() => setIsMobileOpen(false)}
										>
											<LogIn className='mr-2' size={18} />
											Login
										</Link>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};
export default Navbar;
