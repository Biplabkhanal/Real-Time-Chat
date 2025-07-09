import { memo } from "react";

const EmptyState = memo(
    ({ title, description, actionText, onAction, icon: Icon }) => {
        return (
            <div className="text-center py-8">
                {Icon && (
                    <div className="mx-auto mb-4 w-12 h-12 text-gray-400">
                        <Icon className="w-full h-full" />
                    </div>
                )}
                {title && (
                    <h3 className="text-lg font-medium text-white mb-2">
                        {title}
                    </h3>
                )}
                <p className="text-gray-400 mb-4">{description}</p>
                {actionText && onAction && (
                    <button
                        onClick={onAction}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        {actionText}
                    </button>
                )}
            </div>
        );
    }
);

EmptyState.displayName = "EmptyState";

export default EmptyState;
