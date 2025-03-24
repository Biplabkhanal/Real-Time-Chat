const TextArea = ({ inputRef, value, onChange, onKeyDown }) => (
    <textarea
        ref={inputRef}
        rows="1"
        placeholder="Type a message..."
        className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg resize-none
                bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
    />
);

export default TextArea;
