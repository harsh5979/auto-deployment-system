module.exports = function resetSuccessfulMailTemplate(name) {
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
            background-color: #28a745;
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
            Password Reset Successful
          </div>
          <div class="body">
            <p>Dear ${name},</p>
            <p>Your password has been successfully reset. You can now log in to your account using your new password.</p>
            <p>If you did not request this change or suspect any unauthorized activity on your account, please contact our support team immediately.</p>
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
  