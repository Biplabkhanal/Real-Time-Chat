export default function LoadingSpinner({ size = "md", text = "Loading..." }) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
    };

    const textSizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
    };

    return (
        <div className="flex items-center justify-center transition-opacity duration-300">
            <div className="text-center">
                <div
                    className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto mb-4 ${sizeClasses[size]}`}
                ></div>
                <p className={`text-gray-400 ${textSizeClasses[size]}`}>
                    {text}
                </p>
            </div>
        </div>
    );
}
