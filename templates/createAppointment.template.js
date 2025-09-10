module.exports = function createAppointmentMailTemplate(name, appointmentDate, appointmentTime, doctorName) {
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
        .appointment-details {
          font-size: 18px;
          color: #333333;
          margin: 20px 0;
        }
        .highlight {
          color: #4CAF50;
          font-weight: bold;
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
          Appointment Confirmation - iomd✨
        </div>
        <div class="body">
          <p>Dear ${name},</p>
          <p>Your appointment has been successfully booked. Below are the details:</p>
          
          <div class="appointment-details">
            <p><span class="highlight">Doctor:</span>${doctorName}</p>
            <p><span class="highlight">Date:</span> ${appointmentDate}</p>
            <p><span class="highlight">Time:</span> ${appointmentTime}</p>
          </div>

          <p>Please make sure to arrive at the clinic 10 minutes before your scheduled time.</p>
          <p>If you need to reschedule or cancel, contact our support team in advance.</p>

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
