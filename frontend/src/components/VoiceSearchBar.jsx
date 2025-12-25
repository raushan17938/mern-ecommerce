import { useState, useEffect } from "react";
import { Mic, MicOff, Search } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const VoiceSearchBar = () => {
    const [isListening, setIsListening] = useState(false);
    const [status, setStatus] = useState("idle"); // idle, listening, processing
    const navigate = useNavigate();

    useEffect(() => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            console.warn("Browser does not support speech recognition.");
            return;
        }
    }, []);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Keep listening
        recognition.lang = "en-US";
        recognition.interimResults = true; // Get results as they are spoken

        recognition.onstart = () => {
            setIsListening(true);
            setStatus("listening");
        };

        recognition.onend = () => {
            setIsListening(false);
            setStatus("idle");
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
            setStatus("idle");
            if (event.error === 'not-allowed') {
                toast.error("Please allow microphone access to use voice search.");
            } else {
                toast.error("Voice search failed. Please try again.");
            }
        };

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join("")
                .toLowerCase();

            if (event.results[0].isFinal) {
                handleSearch(transcript);
                recognition.stop();
            }
        };

        recognition.start();
    };

    const handleSearch = (searchQuery) => {
        if (!searchQuery.trim()) return;

        const lowerQuery = searchQuery.toLowerCase();
        let category = "";

        if (lowerQuery.includes("jeans")) category = "jeans";
        else if (lowerQuery.includes("t-shirt") || lowerQuery.includes("shirt")) category = "t-shirts";
        else if (lowerQuery.includes("shoe") || lowerQuery.includes("sneaker")) category = "shoes";
        else if (lowerQuery.includes("jacket")) category = "jackets";
        else if (lowerQuery.includes("suit")) category = "suits";
        else if (lowerQuery.includes("bag")) category = "bags";
        else if (lowerQuery.includes("glass")) category = "glasses";

        if (category) {
            navigate(`/category/${category}`);
        } else {
            // Fallback: Navigate to search page
            navigate(`/search?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className='relative flex items-center'>
            <button
                onClick={startListening}
                className={`p-2 rounded-full transition-all duration-300 ${status === "listening"
                    ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    : status === "processing"
                        ? "bg-purple-600 text-white animate-pulse"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                title='Activate "Hey Nova"'
            >
                {status === "idle" ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            {status === "listening" && (
                <span className="absolute right-full mr-2 text-xs text-emerald-400 whitespace-nowrap bg-gray-900 px-2 py-1 rounded border border-emerald-800">
                    Say "Hey Nova..."
                </span>
            )}
            {status === "processing" && (
                <span className="absolute right-full mr-2 text-xs text-purple-400 whitespace-nowrap bg-gray-900 px-2 py-1 rounded border border-purple-800">
                    Processing...
                </span>
            )}
        </div>
    );
};

export default VoiceSearchBar;
