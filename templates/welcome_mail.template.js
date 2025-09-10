module.exports = function welcomeMailTemplate(name) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 24px;
          }
          .body {
            padding: 20px;
            color: #333333;
            line-height: 1.5;
          }
          .welcome-message {
            font-size: 22px;
            font-weight: bold;
            color: #4CAF50;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            background-color: #f4f4f9;
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #888888;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            Welcome to iomd✨
          </div>
          <div class="body">
            <p>Dear ${name},</p>
            <p>We are delighted to have you as part of our community! Thank you for joining iomd✨.</p>
            <p>Explore and enjoy our services. If you have any questions or need assistance, feel free to reach out to our support team.</p>
            <div class="welcome-message">Welcome Aboard!</div>
            <p>We look forward to being a part of your journey.</p>
            <p>Best regards,</p>
            <p>iomd✨ Team</p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} iomd✨. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;
  };
  