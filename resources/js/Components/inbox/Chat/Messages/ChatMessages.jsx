import EmptyState from "../../Shared/States/EmptyState";
import ErrorState from "../../Shared/States/ErrorState";
import LoadingState from "../../Shared/States/LoadingState";
import Message from "./Message";

const ChatMessages = ({
    isLoading,
    isUserSelectionLoading,
    error,
    currentMessages,
    auth,
    getMessages,
    onDeleteMessage,
    targetScrollRef,
}) => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {isUserSelectionLoading ? (
            <LoadingState message="Loading conversation..." />
        ) : (
            <>
                {isLoading && currentMessages.length === 0 && (
                    <LoadingState message="Loading messages..." />
                )}

                {error && (
                    <ErrorState error={error} getMessages={getMessages} />
                )}

                {currentMessages.length === 0 && !isLoading && !error && (
                    <EmptyState />
                )}

                {currentMessages.map((message, index) => (
                    <Message
                        key={index}
                        message={message}
                        isCurrentUser={message.sender_id === auth.user.id}
                        onDelete={onDeleteMessage}
                        auth={auth}
                    />
                ))}
            </>
        )}
        <span ref={targetScrollRef}></span>
    </div>
);

export default ChatMessages;
