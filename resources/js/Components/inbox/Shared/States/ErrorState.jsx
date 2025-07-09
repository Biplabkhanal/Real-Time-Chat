const ErrorState = ({ error, getMessages }) => (
    <div className="bg-red-50 dark:bg-red-900/20 p-4 border-l-4 border-red-500 text-red-700 dark:text-red-300">
        <p>{error}</p>
        <button onClick={getMessages} className="text-sm underline mt-1">
            Try again
        </button>
    </div>
);

export default ErrorState;
