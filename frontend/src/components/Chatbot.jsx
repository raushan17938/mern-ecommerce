import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios"; // Import directly to bypass interceptors for debugging
import { useUserStore } from "../stores/useUserStore";

const localAxios = axios.create({
    baseURL: import.meta.mode === "development" ? "http://localhost:3000/api" : "/api",
    withCredentials: true,
});

const Chatbot = () => {
    const { user } = useUserStore();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I'm Nova. How can I help you today? 👋" },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await localAxios.post("/chatbot", {
                message: userMessage,
                userId: user?._id // Send user ID if logged in
            });
            setMessages((prev) => [...prev, { role: "assistant", content: res.data.response }]);
        } catch (error) {
            console.error("Chatbot error:", error);
            let errorMessage = "Sorry, I'm having trouble connecting to my brain right now. 🤯";

            if (error.response?.status === 401) {
                errorMessage = "Error: Unauthorized (401). Please try refreshing the page.";
            } else if (error.response?.data?.details) {
                // Show actual backend error if available (e.g. "API key invalid")
                errorMessage = `Error: ${error.response.data.details}`;
            }

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: errorMessage },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 p-4 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors z-[9999] ${isOpen ? "hidden" : "block"
                    }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <MessageSquare size={24} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className='fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col z-[9999] overflow-hidden'
                    >
                        {/* Header */}
                        <div className='bg-emerald-700 p-4 flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                                <h3 className='font-bold text-white'>Nova Assistant</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className='text-gray-200 hover:text-white transition-colors'
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800'>
                            {messages.map((msg, index) => (
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl ${msg.role === "user"
                                        ? "bg-emerald-600 text-white rounded-br-none"
                                        : "bg-gray-700 text-gray-200 rounded-bl-none"
                                        }`}
                                >
                                    <div className="text-sm prose prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                                        {msg.role === "assistant" ? (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
                                            </ReactMarkdown>
                                        ) : (
                                            <span className="whitespace-pre-wrap">{msg.content}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className='flex justify-start'>
                                    <div className='bg-gray-700 p-3 rounded-2xl rounded-bl-none flex items-center gap-2'>
                                        <Loader size={16} className='animate-spin text-emerald-400' />
                                        <span className='text-xs text-gray-400'>Nova is thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className='p-4 bg-gray-900 border-t border-gray-700 flex gap-2'>
                            <input
                                type='text'
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder='Ask me anything...'
                                className='flex-1 bg-gray-800 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500'
                            />
                            <button
                                type='submit'
                                disabled={isLoading || !input.trim()}
                                className='p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
