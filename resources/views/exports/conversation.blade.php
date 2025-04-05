<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>ChatSync Conversation History</title>
    <style>
        body {
            font-family: 'Helvetica', Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.4;
        }

        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            padding: 20px;
            margin-bottom: 30px;
            border-bottom: 2px solid #4f46e5;
        }

        .header h1 {
            margin: 0 0 10px 0;
            color: #4f46e5;
        }

        .conversation {
            padding: 20px 0;
        }

        .day-divider {
            text-align: center;
            margin: 20px 0;
            color: #666;
            font-weight: bold;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }

        .message {
            margin-bottom: 20px;
            padding: 10px 15px;
            border-radius: 10px;
            position: relative;
            max-width: 50%;
            page-break-inside: avoid;
        }

        .message-received {
            margin-right: auto;
            border: 1px solid #e2e8f0;
            background-color: #f8fafc;
        }

        .message-sent {
            margin-left: auto;
            border: 1px solid #c7d2fe;
            background-color: #eef2ff;
        }

        .sender {
            font-weight: lighter;
            margin-bottom: 5px;
            font-size: 12px;
            color: #4f46e5;
            text-align: left;

        }

        .message-content {
            word-wrap: break-word;
        }

        .timestamp {
            font-size: 10px;
            text-align: right;
            color: #666;
            margin-top: 5px;
        }

        .attachment {
            margin-top: 10px;
        }

        .attachment img {
            max-width: 100%;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        .attachment-icon {
            background-color: #f8fafc;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 12px;
        }

        .page-footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
        }

        .logo {
            font-weight: bold;
            color: #4f46e5;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>ChatSync Conversation</h1>
            <p>{{ $currentUser->name }} and {{ $otherUser->name }}</p>
            <p>
                {{ $messages->count() }} messages from {{ $messages->first()->created_at->format('M j, Y') }}
                to {{ $messages->last()->created_at->format('M j, Y') }}
            </p>
            <p>Generated on {{ now()->format('F j, Y \a\t g:i A') }}</p>
        </div>

        <div class="conversation">
            @php $currentDate = null; @endphp

            @foreach ($messages as $message)
                @php
                    $messageDate = $message->created_at->format('Y-m-d');
                @endphp

                @if ($currentDate !== $messageDate)
                    <div class="day-divider">{{ $message->created_at->format('l, F j, Y') }}</div>
                    @php $currentDate = $messageDate; @endphp
                @endif

                <div
                    class="message {{ $message->sender_id === $currentUser->id ? 'message-sent' : 'message-received' }}">
                    <div class="sender">{{ $message->sender_id === $currentUser->id ? 'You' : $otherUser->name }}</div>
                    <div class="message-content">{{ $message->message }}</div>

                    @if (!empty($message->attachment))
                        @php
                            $attachmentPath = is_object($message->attachment)
                                ? $message->attachment->path ?? ''
                                : $message->attachment;

                            $isImage = false;
                            $fileName = '';

                            if (is_string($attachmentPath) && !empty($attachmentPath)) {
                                $fileExtension = pathinfo($attachmentPath, PATHINFO_EXTENSION);
                                $fileName = basename($attachmentPath);
                                $isImage = in_array(strtolower($fileExtension), ['jpg', 'jpeg', 'png', 'gif', 'webp']);
                            }
                        @endphp

                        <div class="attachment">
                            @if ($isImage && isset($message->imageData))
                                <img src="{{ $message->imageData }}" alt="Image">
                            @elseif ($isImage)
                                <img src="{{ asset('storage/chat_attachments/' . $attachmentPath) }}" alt="Image">
                            @elseif (!empty($fileName))
                                <div class="attachment-icon">
                                    {{ $fileName }}
                                </div>
                            @else
                                <div class="attachment-icon">[Attachment unavailable]</div>
                            @endif
                        </div>
                    @endif

                    <div class="timestamp">{{ $message->created_at->format('g:i A') }}</div>
                </div>
            @endforeach
        </div>

        <div class="page-footer">
            <div class="logo">ChatSync</div>
            <p>This conversation export contains {{ $messages->count() }} messages between {{ $currentUser->name }}
                and {{ $otherUser->name }}</p>
        </div>
    </div>
</body>

</html>
