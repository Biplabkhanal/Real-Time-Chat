<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your ChatSync Password</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

        body {
            font-family: 'Poppins', Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .logo-container {
            text-align: center;
            margin-bottom: 10px;
        }

        .logo-svg {
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
            margin: 0 auto 15px;
            display: block;
        }

        .header {
            text-align: center;
            background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
            padding: 10px 0 !important;
        }


        .header h1 {
            margin: 0;
            font-weight: 600;
            font-size: 28px;
            letter-spacing: 0.5px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
            color: white !important;
            text-align: center !important;
        }

        .content {
            padding: 31px !important;
            color: #4a4a4a;
        }

        .welcome-message {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 25px;
            color: #333;
        }

        .highlight {
            background-color: #f3f0ff;
            border-left: 4px solid #a777e3;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }

        .time-warning {
            color: #e74c3c;
            font-weight: 600;
        }

        .button-container {
            text-align: center;
            margin: 35px 0;
        }

        .button {
            display: inline-block;
            background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
            color: white;
            padding: 10px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 4px 10px rgba(106, 142, 251, 0.3);
        }

        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(106, 142, 251, 0.4);
        }


        .footer {
            padding: 15px;
            background-color: #f7f7fd;
            text-align: center;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #eee;
            width: 600px !important;
        }

        .signature {
            margin: 25px 0 15px;
            font-weight: 500;
        }

        .divider {
            height: 1px;
            background-color: #eee;
            margin: 25px 0;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <img src="{{ $message->embed(public_path('images/chatsync.png')) }}" alt="ChatSync Logo" class="logo-svg"
                    width="80" height="80">
            </div>
            <h1>ChatSync</h1>
        </div>

        <div class="content">
            <div class="welcome-message">Hello {{ $user->name ?? 'there' }}! 👋</div>

            <p>We received a request to reset your ChatSync account password. We're here to help you regain access
                to
                your account safely.</p>

            <div class="highlight">
                Please click the button below to set a new password. <span class="time-warning">This link will
                    expire in
                    60 seconds</span> for security purposes.
            </div>

            <div class="button-container">
                <a href="{{ $url }}" class="button">Reset My Password</a>
            </div>

            <div class="divider"></div>

            <p class="signature">Cheers,<br>The ChatSync Team</p>
        </div>

        <div class="footer">
            <div class="social-links" style="margin: 15px 0; text-align: center;">
                <a href="#"
                    style="display: inline-block;  margin:0 2px; width: 35px; height: 35px; text-align: center; line-height: 36px; text-decoration: none;">
                    <img src="{{ $message->embed(public_path('images/facebook.png')) }}" width="23" height="23"
                        alt="Facebook" style="vertical-align: middle; margin-top: 8px;">
                </a>
                <a href="#"
                    style="display: inline-block; margin:0 2px; width: 35px; height: 35px; text-align: center; line-height: 36px; text-decoration: none;">
                    <img src="{{ $message->embed(public_path('images/twitter.png')) }}" width="23" height="23"
                        alt="Twitter" style="vertical-align: middle; margin-top: 8px;">
                </a>
                <a href="#"
                    style="display: inline-block; margin:0 2px; width: 35px; height: 35px;text-align: center; line-height: 36px; text-decoration: none;">
                    <img src="{{ $message->embed(public_path('images/linkedin.png')) }}" width="23" height="23"
                        alt="LinkedIn" style="vertical-align: middle; margin-top: 8px;">
                </a>
                <a href="#"
                    style="display: inline-block; margin:0 2px; width: 35px; height: 35px;text-align: center; line-height: 36px; text-decoration: none;">
                    <img src="{{ $message->embed(public_path('images/insta.png')) }}" width="23" height="23"
                        alt="Instagram" style="vertical-align: middle; margin-top: 8px;">
                </a>
            </div>
            <p>© {{ date('Y') }} ChatSync. All rights reserved.</p>
            <p>Kathmandu, Nepal</p>
            <p style="color: #df1c1c; padding-bottom: 12px;">
                This is an automated email, please do not reply to this message.***
            </p>
        </div>
    </div>
</body>

</html>
