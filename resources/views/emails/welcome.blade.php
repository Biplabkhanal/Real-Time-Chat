<!DOCTYPE html>
<html>

<head>
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

        .header {
            text-align: center;
            padding: 10px 0;
            background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
            color: white;
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


        .header h1 {
            margin: 0;
            font-weight: 600;
            font-size: 28px;
            letter-spacing: 0.5px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }

        .content {
            padding: 35px;
            color: #4a4a4a !important;
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

        .features {
            display: flex;
            justify-content: space-between;
            margin: 30px 0;
            flex-wrap: wrap;
        }

        .feature {
            flex-basis: 30%;
            text-align: center;
            margin-bottom: 15px;
        }

        .feature-icon {
            font-size: 24px;
            margin-bottom: 8px;
            color: #6e8efb;
        }

        .button-container {
            text-align: center;
            margin: 35px 0;
        }

        .button {
            display: inline-block;
            background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
            color: white !important;
            padding: 10px 30px;
            text-decoration: none;
            border-radius: 10px !important;
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
        }


        .social-links {
            margin: 15px 0;
            text-align: center;
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
            <h1>Welcome to ChatSync!</h1>
        </div>

        <div class="content">
            <div class="welcome-message">Hello {{ $user->name }}! 👋</div>

            <p>We're thrilled you've joined our growing community of <b>ChatSync</b> users!</p>

            <div class="highlight">
                Your account has been successfully created and is ready to use. Dive in and discover the seamless
                communication experience we've built for you.
            </div>

            <p>Get started in just one click:</p>

            <div class="button-container">
                <a href="{{ url('/inbox') }}" class="button">Launch ChatSync</a>
            </div>

            <p>If you have any questions or need assistance, our support team is always ready to help!</p>

            <p><b>Cheers,<br>The ChatSync Team</b></p>
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
            <p style="color: #df1c1c;">
                This is an automated email, please do not reply to this message.***
            </p>
        </div>
    </div>
</body>

</html>
