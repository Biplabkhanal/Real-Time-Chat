const AddButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
    >
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
            />
        </svg>
    </button>
);

export default AddButton;
