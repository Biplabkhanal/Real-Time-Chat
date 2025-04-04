import EmojiIcon from "../icons/EmojiIcon";

const EmojiButton = ({ onClick }) => (
    <button
        onClick={onClick}
        type="button"
        aria-label="Choose emoji"
        className="p-2 text-gray-500 dark:text-gray-400 hover:text-white dark:hover:text-white rounded-full transition-colors duration-200 group"
    >
        <div className="group-hover:text-white transition-colors duration-200">
            <EmojiIcon />
        </div>
    </button>
);

export default EmojiButton;
