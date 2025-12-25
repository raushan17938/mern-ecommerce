import { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Lock, Loader, Package } from "lucide-react";
import UserOrdersList from "../components/UserOrdersList";

const ProfilePage = () => {
    const { user, updateProfile, updatePassword, loading } = useUserStore();

    const [activeTab, setActiveTab] = useState("profile");
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        address: {
            street: user?.address?.street || "",
            city: user?.address?.city || "",
            state: user?.address?.state || "",
            postalCode: user?.address?.postalCode || "",
            country: user?.address?.country || "",
            phone: user?.address?.phone || "",
        },
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleProfileChange = (e) => {
        if (e.target.name.startsWith("address.")) {
            const addressField = e.target.name.split(".")[1];
            setProfileData({
                ...profileData,
                address: { ...profileData.address, [addressField]: e.target.value },
            });
        } else {
            setProfileData({ ...profileData, [e.target.name]: e.target.value });
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        await updateProfile(profileData);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        await updatePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
        });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    return (
        <div className='min-h-screen bg-gray-900 text-white pt-20 pb-10 px-4'>
            <div className='max-w-4xl mx-auto'>
                <motion.h1
                    className='text-3xl font-bold mb-8 text-center text-emerald-400'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    My Profile
                </motion.h1>

                <div className='flex justify-center mb-8'>
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`px-6 py-2 rounded-l-lg transition-colors ${activeTab === "profile" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300"
                            }`}
                    >
                        Profile Details
                    </button>
                    <button
                        onClick={() => setActiveTab("password")}
                        className={`px-6 py-2 transition-colors ${activeTab === "password" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300"
                            }`}
                    >
                        Change Password
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`px-6 py-2 rounded-r-lg transition-colors ${activeTab === "orders" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300"
                            }`}
                    >
                        My Orders
                    </button>
                </div>

                <motion.div
                    className='bg-gray-800 rounded-lg shadow-lg p-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {activeTab === "profile" ? (
                        <form onSubmit={handleProfileSubmit} className='space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                                        <User size={18} className='inline mr-2' /> Full Name
                                    </label>
                                    <input
                                        type='text'
                                        name='name'
                                        value={profileData.name}
                                        onChange={handleProfileChange}
                                        className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                                        <Mail size={18} className='inline mr-2' /> Email
                                    </label>
                                    <input
                                        type='email'
                                        name='email'
                                        value={profileData.email}
                                        onChange={handleProfileChange}
                                        className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                    />
                                </div>
                            </div>

                            <h3 className='text-xl font-semibold text-emerald-400 mt-6 mb-4'>
                                <MapPin size={20} className='inline mr-2' /> Address Details
                            </h3>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-300 mb-2'>Street Address</label>
                                    <input
                                        type='text'
                                        name='address.street'
                                        value={profileData.address.street}
                                        onChange={handleProfileChange}
                                        className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-300 mb-2'>City</label>
                                    <input
                                        type='text'
                                        name='address.city'
                                        value={profileData.address.city}
                                        onChange={handleProfileChange}
                                        className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-300 mb-2'>State</label>
                                    <input
                                        type='text'
                                        name='address.state'
                                        value={profileData.address.state}
                                        onChange={handleProfileChange}
                                        className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-300 mb-2'>Postal Code</label>
                                    <input
                                        type='text'
                                        name='address.postalCode'
                                        value={profileData.address.postalCode}
                                        onChange={handleProfileChange}
                                        className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-300 mb-2'>Country</label>
                                    <input
                                        type='text'
                                        name='address.country'
                                        value={profileData.address.country}
                                        onChange={handleProfileChange}
                                        className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-300 mb-2'>Phone</label>
                                    <input
                                        type='text'
                                        name='address.phone'
                                        value={profileData.address.phone}
                                        onChange={handleProfileChange}
                                        className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                    />
                                </div>
                            </div>

                            <button
                                type='submit'
                                className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center'
                                disabled={loading}
                            >
                                {loading ? <Loader className='animate-spin mr-2' /> : "Update Profile"}
                            </button>
                        </form>
                    ) : activeTab === "orders" ? (
                        <UserOrdersList />
                    ) : (
                        <form onSubmit={handlePasswordSubmit} className='space-y-6'>
                            <div>
                                <label className='block text-sm font-medium text-gray-300 mb-2'>
                                    <Lock size={18} className='inline mr-2' /> Current Password
                                </label>
                                <input
                                    type='password'
                                    name='currentPassword'
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-300 mb-2'>
                                    <Lock size={18} className='inline mr-2' /> New Password
                                </label>
                                <input
                                    type='password'
                                    name='newPassword'
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-300 mb-2'>
                                    <Lock size={18} className='inline mr-2' /> Confirm New Password
                                </label>
                                <input
                                    type='password'
                                    name='confirmPassword'
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                />
                            </div>

                            <button
                                type='submit'
                                className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center'
                                disabled={loading}
                            >
                                {loading ? <Loader className='animate-spin mr-2' /> : "Update Password"}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
