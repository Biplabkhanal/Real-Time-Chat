const EmojiStatsDisplay = ({ emojiStats, loading, error }) => {
    if (loading)
        return (
            <div className="p-4 text-center text-gray-500">
                Loading emoji stats...
            </div>
        );
    if (error)
        return <div className="p-4 text-center text-red-500">{error}</div>;
    if (!emojiStats || emojiStats.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No emojis used in this conversation yet.
            </div>
        );
    }

    return (
        <div className="p-4">
            <h3 className="text-lg font-medium mb-3">Most Used Emojis</h3>
            <div className="grid grid-cols-2 gap-3">
                {emojiStats.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center p-2 bg-gray-50 rounded-lg"
                    >
                        <span className="text-2xl mr-2">{item.emoji}</span>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">
                                {item.count} times
                            </span>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                    className="bg-blue-600 h-1.5 rounded-full"
                                    style={{
                                        width: `${Math.min(
                                            100,
                                            (item.count / emojiStats[0].count) *
                                                100
                                        )}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmojiStatsDisplay;
