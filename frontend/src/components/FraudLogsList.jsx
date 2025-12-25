import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../lib/axios";
import { Loader } from "lucide-react";

const FraudLogsList = () => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await axios.get("/analytics/fraud-logs");
                setLogs(res.data);
            } catch (error) {
                console.error("Error fetching fraud logs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-64'>
                <Loader className='animate-spin h-8 w-8 text-emerald-500' />
            </div>
        );
    }

    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <table className='min-w-full divide-y divide-gray-700'>
                <thead className='bg-gray-700'>
                    <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                            User
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                            Amount
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                            Reason
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                            Date
                        </th>
                    </tr>
                </thead>

                <tbody className='bg-gray-800 divide-y divide-gray-700'>
                    {logs.map((log) => (
                        <tr key={log._id} className='hover:bg-gray-700'>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='flex items-center'>
                                    <div className='ml-4'>
                                        <div className='text-sm font-medium text-white'>{log.userId?.name || "Unknown"}</div>
                                        <div className='text-sm text-gray-400'>{log.userId?.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-300'>${log.transactionAmount.toFixed(2)}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-800 text-red-100'>
                                    {log.reason}
                                </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {logs.length === 0 && (
                <div className='p-8 text-center text-gray-400'>No fraud logs found</div>
            )}
        </motion.div>
    );
};
export default FraudLogsList;
