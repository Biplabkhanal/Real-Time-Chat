import EmojiIcon from "../icons/EmojiIcon";

const EmojiButton = ({ onClick }) => (
    <button
        onClick={onClick}
        type="button"
        aria-label="Choose emoji"
        className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
    >
        <EmojiIcon />
    </button>
);

export default EmojiButton;
