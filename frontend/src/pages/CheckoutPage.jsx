import { useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
import { motion } from "framer-motion";

const stripePromise = loadStripe(
    "pk_test_51S5qvwPXaGCw21ozzKEnj9DGXmX98vBSez8Extwv4fK84vOx1DCsovBaPuw7Lv19wUiolZlOjIPTK1pcqyS3TFGW00bhWtC0dh"
);

const CheckoutPage = () => {
    const { cart, coupon, total } = useCartStore();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        village: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India", // Default to India or make it selectable
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        const stripe = await stripePromise;
        const res = await axios.post("/payments/create-checkout-session", {
            products: cart,
            couponCode: coupon ? coupon.code : null,
            shippingAddress: formData,
        });

        const session = res.data;
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            console.error("Error:", result.error);
        }
    };

    return (
        <div className='min-h-screen bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8'>
            <motion.div
                className='max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className='text-3xl font-bold text-emerald-400 mb-8 text-center'>Checkout</h2>
                <form onSubmit={handlePayment} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label className='block text-sm font-medium text-gray-300'>Full Name</label>
                            <input
                                type='text'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-300'>Email</label>
                            <input
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                            />
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-300'>Phone Number</label>
                        <input
                            type='tel'
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-300'>Address (Street, House No.)</label>
                        <input
                            type='text'
                            name='street'
                            value={formData.street}
                            onChange={handleChange}
                            required
                            className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                        />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label className='block text-sm font-medium text-gray-300'>Village / Area</label>
                            <input
                                type='text'
                                name='village'
                                value={formData.village}
                                onChange={handleChange}
                                required
                                className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-300'>City</label>
                            <input
                                type='text'
                                name='city'
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <div>
                            <label className='block text-sm font-medium text-gray-300'>State</label>
                            <input
                                type='text'
                                name='state'
                                value={formData.state}
                                onChange={handleChange}
                                required
                                className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-300'>Pincode</label>
                            <input
                                type='text'
                                name='postalCode'
                                value={formData.postalCode}
                                onChange={handleChange}
                                required
                                className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-300'>Country</label>
                            <input
                                type='text'
                                name='country'
                                value={formData.country}
                                onChange={handleChange}
                                required
                                className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                            />
                        </div>
                    </div>

                    <div className='border-t border-gray-700 pt-6 mt-6'>
                        <div className='flex justify-between text-lg font-semibold mb-4'>
                            <span>Total Amount:</span>
                            <span className='text-emerald-400'>₹{total.toFixed(2)}</span>
                        </div>
                        <button
                            type='submit'
                            className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg transform hover:scale-105'
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CheckoutPage;
