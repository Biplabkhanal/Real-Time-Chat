import LoadingSpinner from "@/Components/LoadingSpinner";
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
    onForwardMessage,
    targetScrollRef,
    selectedUser,
}) => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900">
        {isUserSelectionLoading ? (
            <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <LoadingSpinner size="lg" text="Loading conversation..." />
            </div>
        ) : (
            <>
                {isLoading && currentMessages.length === 0 && (
                    <LoadingSpinner size="lg" message="Loading messages..." />
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
                        onForward={onForwardMessage}
                        auth={auth}
                        selectedUser={selectedUser}
                    />
                ))}
            </>
        )}
        <span ref={targetScrollRef}></span>
    </div>
);

export default ChatMessages;
