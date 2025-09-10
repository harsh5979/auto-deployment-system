module.exports = function forgotPasswordMailTemplate(email, resetLink) {
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
            background-color: #ff6f61;
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
          .reset-button {
            display: inline-block;
            margin: 20px 0;
            background-color: #ff6f61;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 4px;
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
            Reset Your Password
          </div>
          <div class="body">
            <p>Dear ${email},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href="${resetLink}" class="reset-button">Reset Password</a>
            <p>If you did not request this, you can safely ignore this email.</p>
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
  