import React, { useEffect, useRef, useState } from "react";
import TextArea from "./TextArea";
import EmojiButton from "./EmojiButton";
import FileUploadButton from "./FileUploadButton";
import SendButton from "../icons/SendButton";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({
    inputRef,
    messageInput,
    setMessageInput,
    handleKeyDown,
    isLoading,
    attachments,
    setAttachments,
    sendMessage,
}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiContainerRef.current &&
                !emojiContainerRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const onEmojiClick = (emojiObject) => {
        const cursor = inputRef.current.selectionStart;
        const text = messageInput;
        const textBeforeCursor = text.slice(0, cursor);
        const textAfterCursor = text.slice(cursor);
        const newText = textBeforeCursor + emojiObject.emoji + textAfterCursor;
        setMessageInput(newText);
    };

    return (
        <div className="flex items-center relative">
            <div className="flex-1 relative flex items-center">
                <TextArea
                    inputRef={inputRef}
                    value={messageInput}
                    onChange={setMessageInput}
                    onKeyDown={handleKeyDown}
                />
                <div className="absolute right-3 flex space-x-1 items-center h-full">
                    <div className="relative" ref={emojiContainerRef}>
                        <EmojiButton
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        />
                        {showEmojiPicker && (
                            <div className="absolute bottom-12 right-0 z-[999]">
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl transition-colors duration-200">
                                    <div className="emoji-picker-container [&>*]:!bg-white [&>*]:dark:!bg-gray-800">
                                        <EmojiPicker
                                            onEmojiClick={onEmojiClick}
                                            disableSearchBar={true}
                                            native
                                            theme="auto"
                                            width={320}
                                            height={400}
                                            className="!border-none"
                                            lazyLoadEmojis={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
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
};

export default MessageInput;
