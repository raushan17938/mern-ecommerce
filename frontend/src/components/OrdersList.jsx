import { useEffect, useState } from "react";
import { useOrderStore } from "../stores/useOrderStore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Package, XCircle, ChevronDown, ChevronUp, Download, Search, Filter } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";

const OrdersList = () => {
    const { orders, fetchAllOrders, updateOrderStatus, loading } = useOrderStore();
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        fetchAllOrders();
    }, [fetchAllOrders]);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            case "Processing":
                return "text-blue-400 bg-blue-400/10 border-blue-400/20";
            case "Shipped":
                return "text-purple-400 bg-purple-400/10 border-purple-400/20";
            case "Delivered":
                return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
            case "Cancelled":
                return "text-red-400 bg-red-400/10 border-red-400/20";
            default:
                return "text-gray-400 bg-gray-400/10 border-gray-400/20";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Pending": return <Clock className='w-4 h-4' />;
            case "Processing": return <Package className='w-4 h-4' />;
            case "Shipped": return <Package className='w-4 h-4' />;
            case "Delivered": return <CheckCircle className='w-4 h-4' />;
            case "Cancelled": return <XCircle className='w-4 h-4' />;
            default: return <Clock className='w-4 h-4' />;
        }
    };

    const handleDownloadInvoice = (order) => {
        try {
            const doc = new jsPDF();
            // ... (Invoice generation logic remains largely the same, just keeping it functional)
            // Add Title
            doc.setFontSize(20);
            doc.text("Invoice", 105, 20, null, null, "center");

            // Add Order Details
            doc.setFontSize(12);
            doc.text(`Order ID: ${order._id}`, 20, 40);
            doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 50);
            doc.text(`Status: ${order.status}`, 20, 60);

            // Add Customer Details
            doc.text("Customer Details:", 20, 80);
            doc.setFontSize(10);
            doc.text(`Name: ${order.user?.name || "N/A"}`, 20, 90);
            doc.text(`Email: ${order.user?.email || "N/A"}`, 20, 100);

            // Add Shipping Address
            doc.setFontSize(12);
            doc.text("Shipping Address:", 120, 80);
            doc.setFontSize(10);
            const address = order.shippingAddress;
            if (address) {
                doc.text(`${address.street || ""}`, 120, 90);
                doc.text(`${address.village ? address.village + ", " : ""}${address.city || ""}`, 120, 100);
                doc.text(`${address.state || ""} - ${address.postalCode || ""}`, 120, 110);
                doc.text(`${address.country || ""}`, 120, 120);
                doc.text(`Phone: ${address.phone || "N/A"}`, 120, 130);
            } else {
                doc.text("No shipping address provided", 120, 90);
            }

            // Add Products Table
            const tableColumn = ["Product", "Quantity", "Unit Price", "Total"];
            const tableRows = [];

            order.products.forEach((item) => {
                const productData = [
                    item.product?.name || "Unknown Product",
                    item.quantity,
                    `₹${item.price.toFixed(2)}`,
                    `₹${(item.price * item.quantity).toFixed(2)}`,
                ];
                tableRows.push(productData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 150,
            });

            // Add Total Amount
            const finalY = doc.lastAutoTable.finalY || 150;
            doc.setFontSize(14);
            doc.text(`Total Amount: ₹${order.totalAmount.toFixed(2)}`, 140, finalY + 20);

            // Save the PDF
            doc.save(`invoice_${order._id}.pdf`);
            toast.success("Invoice downloaded successfully");
        } catch (error) {
            console.error("Error generating invoice:", error);
            toast.error("Failed to generate invoice");
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className='flex justify-center items-center h-64'>
                <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500'></div>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className='mb-8'
            >
                <h2 className='text-3xl font-bold text-emerald-400 text-center mb-4'>Order Management</h2>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-800/50 backdrop-blur-md p-4 rounded-xl border border-gray-700/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search Order ID or Customer..."
                            className="w-full bg-gray-700/50 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-gray-600/50 transition-all placeholder-gray-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative w-full md:w-48">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <select
                                className="w-full bg-gray-700/50 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-gray-600/50 appearance-none cursor-pointer"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className='grid gap-6'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700/50">
                        <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-400">No orders found</h3>
                    </div>
                ) : (
                    filteredOrders.map((order, index) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className='bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:bg-gray-800/60 transition-all duration-300 shadow-lg hover:shadow-emerald-900/10'
                        >
                            <div
                                className="p-6 cursor-pointer"
                                onClick={() => toggleOrderDetails(order._id)}
                            >
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    {/* Order Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded font-mono">#{order._id.slice(-6).toUpperCase()}</span>
                                            <span className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                {order.user?.name ? order.user.name.charAt(0).toUpperCase() : "?"}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">{order.user?.name || "Unknown User"}</h3>
                                                <p className="text-gray-400 text-sm hidden sm:block">{order.user?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount & Status */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full md:w-auto">
                                        <div className="text-left sm:text-right">
                                            <p className="text-sm text-gray-400">Total Amount</p>
                                            <p className="text-xl font-bold text-emerald-400">₹{order.totalAmount.toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                            <div className="relative group/status z-10">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className={`appearance-none pl-10 pr-8 py-2 rounded-full text-sm font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ${getStatusColor(order.status)}`}
                                                >
                                                    <option value='Pending'>Pending</option>
                                                    <option value='Processing'>Processing</option>
                                                    <option value='Shipped'>Shipped</option>
                                                    <option value='Delivered'>Delivered</option>
                                                    <option value='Cancelled'>Cancelled</option>
                                                </select>
                                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                    {getStatusIcon(order.status)}
                                                </div>
                                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50" />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownloadInvoice(order);
                                                    }}
                                                    className='p-2 bg-gray-700/50 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 rounded-lg transition-all duration-300'
                                                    title='Download Invoice'
                                                >
                                                    <Download size={20} />
                                                </button>
                                                <div className={`transform transition-transform duration-300 ${expandedOrderId === order._id ? 'rotate-180' : ''}`}>
                                                    <ChevronDown className="text-gray-500" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                                {expandedOrderId === order._id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-t border-gray-700/50 bg-gray-900/30"
                                    >
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Order Items */}
                                            <div>
                                                <h4 className='text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4'>Order Items</h4>
                                                <div className="space-y-4">
                                                    {order.products.map((item) => (
                                                        <div key={item.product?._id || Math.random()} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-12 w-12 rounded bg-gray-700 overflow-hidden flex-shrink-0">
                                                                    <img
                                                                        src={item.product?.image}
                                                                        alt={item.product?.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-white text-sm line-clamp-1">{item.product?.name || "Unknown Product"}</p>
                                                                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                                                                </div>
                                                            </div>
                                                            <p className="font-semibold text-emerald-400">₹{item.price.toFixed(2)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Shipping Info */}
                                            <div>
                                                <h4 className='text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4'>Shipping Details</h4>
                                                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 h-full">
                                                    {order.shippingAddress ? (
                                                        <div className="space-y-3 text-sm">
                                                            <div>
                                                                <p className="text-gray-500 text-xs mb-1">Recipient</p>
                                                                <p className="text-white font-medium">{order.shippingAddress.name || order.user?.name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500 text-xs mb-1">Address</p>
                                                                <p className="text-gray-300">
                                                                    {order.shippingAddress.street}<br />
                                                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                                                                    {order.shippingAddress.country}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500 text-xs mb-1">Contact</p>
                                                                <p className="text-gray-300">{order.shippingAddress.phone || "N/A"}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className='text-gray-400 italic'>No shipping address available.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </motion.div>
        </div>
    );
};

export default OrdersList;
