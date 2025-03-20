<x-mail::message>
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4F46E5; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">ChatSync</h1>
        <div style="margin: 20px 0;">
            <svg style="width: 60px; height: 60px; margin: 0 auto; color: #4F46E5;" fill="currentColor" viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clip-rule="evenodd" />
            </svg>
        </div>
    </div>

    <div
        style="background-color: #F3F4F6; padding: 25px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #E5E7EB;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">Hello from ChatSync!</p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            We received a request to reset your ChatSync account password. Click the button below to reset it. This link
            will expire in 60 seconds for security purposes.
        </p>
    </div>

    <x-mail::button :url="$url" color="primary">
        Reset Your Password
    </x-mail::button>

    <p style="color: #6B7280; font-size: 14px; margin: 25px 0; text-align: center;">
        If you didn't request this password reset, please ignore this email or contact support if you have concerns.
    </p>

    Thanks,<br>
    ChatSync Team

    <div style="text-align: center; margin-top: 30px;">
        <p style="color: #9CA3AF; font-size: 12px;">
            &copy; {{ date('Y') }} ChatSync. All rights reserved.
        </p>
    </div>
</x-mail::message>
