import { useEffect } from "react";
import { motion } from "framer-motion";
import { useOrderStore } from "../stores/useOrderStore";
import { Loader, Package, XCircle } from "lucide-react";

const UserOrdersList = () => {
    const { myOrders, fetchMyOrders, cancelOrder, loading } = useOrderStore();

    useEffect(() => {
        fetchMyOrders();
    }, [fetchMyOrders]);

    if (loading && myOrders.length === 0) {
        return <Loader className='animate-spin mx-auto' size={40} />;
    }

    if (myOrders.length === 0) {
        return (
            <div className='text-center text-gray-300 py-8'>
                <Package size={48} className='mx-auto mb-4 opacity-50' />
                <p>You haven't placed any orders yet.</p>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {myOrders.map((order) => (
                <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700'
                >
                    <div className='p-6'>
                        <div className='flex flex-wrap justify-between items-center mb-4 gap-4'>
                            <div>
                                <p className='text-sm text-gray-400'>Order ID: <span className="text-white font-mono">{order._id}</span></p>
                                <p className='text-sm text-gray-400'>Date: <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                            </div>
                            <div className='flex items-center gap-4'>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "Delivered" ? "bg-green-500/20 text-green-400" :
                                    order.status === "Cancelled" ? "bg-red-500/20 text-red-400" :
                                        "bg-yellow-500/20 text-yellow-400"
                                    }`}>
                                    {order.status}
                                </span>
                                <span className='text-xl font-bold text-emerald-400'>₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className='space-y-4 mb-6'>
                            {order.products.map((item) => (
                                <div key={item.product?._id || item._id} className='flex items-center gap-4 bg-gray-700/50 p-3 rounded-md'>
                                    <img
                                        src={item.product?.image}
                                        alt={item.product?.name}
                                        className='w-16 h-16 object-cover rounded-md'
                                    />
                                    <div className='flex-1'>
                                        <h4 className='font-medium text-white'>{item.product?.name}</h4>
                                        <p className='text-sm text-gray-400'>Quantity: {item.quantity}</p>
                                        <p className='text-sm text-emerald-400'>₹{item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {(order.status === "Pending" || order.status === "Processing") && (
                            <div className='flex justify-end'>
                                <button
                                    onClick={() => cancelOrder(order._id)}
                                    disabled={loading}
                                    className='flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm font-medium disabled:opacity-50'
                                >
                                    {loading ? <Loader size={16} className="animate-spin" /> : <XCircle size={16} />}
                                    Cancel Order
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default UserOrdersList;
