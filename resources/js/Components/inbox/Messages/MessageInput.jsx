import React from "react";
import TextArea from "./TextArea";
import EmojiButton from "./EmojiButton";
import FileUploadButton from "./FileUploadButton";
import SendButton from "./SendButton";

const MessageInput = ({
    inputRef,
    messageInput,
    setMessageInput,
    handleKeyDown,
    isLoading,
    attachments,
    setAttachments,
    sendMessage,
}) => (
    <div className="flex items-center">
        <div className="flex-1 relative">
            <TextArea
                inputRef={inputRef}
                value={messageInput}
                onChange={setMessageInput}
                onKeyDown={handleKeyDown}
            />
            <div className="absolute right-3 bottom-3 flex space-x-1">
                <EmojiButton />
                <FileUploadButton
                    onFileSelect={setAttachments}
                    existingAttachments={attachments}
                />
            </div>
        </div>
        <SendButton
            onClick={sendMessage}
            disabled={
                isLoading ||
                (messageInput.trim() === "" && attachments.length === 0)
            }
            isLoading={isLoading}
        />
    </div>
);

export default MessageInput;
