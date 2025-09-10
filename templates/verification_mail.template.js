module.exports = function mailTemplate(otp) {
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
          .otp {
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
            Account Verification
          </div>
          <div class="body">
            <p>Dear User,</p>
            <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for the next 24 hours. If you did not request this, please ignore this email.</p>
            <p>Best regards,</p>
            <p>iomd✨</p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} iomd✨. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;
  };
  