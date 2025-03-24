import LoadingSpinner from "./LoadingSpinner";
import SendIcon from "./SendIcon";

const SendButton = ({ onClick, disabled, isLoading }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`ml-4 p-3 rounded-full ${
            disabled
                ? "bg-blue-300 dark:bg-blue-800 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
        } text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    >
        {isLoading ? <LoadingSpinner /> : <SendIcon />}
    </button>
);

export default SendButton;
