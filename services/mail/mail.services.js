const {sendMail} = require('../../configs/mail.config');
const verificationMailTemplate = require('../../templates/verification_mail.template');
const welcomeMailTemplate = require('../../templates/welcome_mail.template');
const forgotPasswordMailTemplate = require('../../templates/forgotPassword_mail.template');
const resetSuccessfulMailTemplate = require('../../templates/resetPasswordSuccessfully.template');
const resentOtpTamplate = require('../../templates/resentOtp.tamplate');
const createAppointmentMailTemplate = require('../../templates/createAppointment.template')

exports.sendVerificationEmail = async (email, otp) => {
  const subject = 'Account Verification - Your OTP Code';
  const template = verificationMailTemplate(otp);
  await sendMail(email, subject, template);
};

exports.sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to iomd✨';
  const template = welcomeMailTemplate(name);
  await sendMail(email, subject, template);
};

exports.sendForgotPasswordEmail = async (email, resetLink) => {
  const subject = 'Reset your password';
  const template = forgotPasswordMailTemplate(email, resetLink);
  await sendMail(email, subject, template);
};

exports.sendresetPasswordEmail = async (email,name) => {
  const subject = 'Password Reset Successful';
  const template = resetSuccessfulMailTemplate(name);
  await sendMail(email, subject, template);
};

exports.resentOtp = async (email, otp )=>{
  const subject = 'Resend OTP - Your OTP Code';
  const template = resentOtpTamplate(otp);
  await sendMail(email, subject, template);
}
exports.createAppointment = async (email, firstName, appointmentDate, appointmentTime, doctorName )=>{
  const subject = 'Appointment Created Successfully - iomd✨';
  const template = createAppointmentMailTemplate(firstName, appointmentDate, appointmentTime, doctorName);
  await sendMail(email, subject, template);
}

