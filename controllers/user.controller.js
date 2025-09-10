const usermodel = require('../models/User.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { generateTokenAndSetCookie } = require('../services/token/generateTokenAndSetCookie');
const { sendVerificationEmail, sendWelcomeEmail, sendForgotPasswordEmail, sendresetPasswordEmail, resentOtp } = require('../services/mail/mail.services');


async function generateRandomPassword() {
  const randomString = crypto.randomBytes(16).toString('base64');

  const hashedPassword = await bcrypt.hash(randomString, 10);

  return hashedPassword;
}

exports.register = async (req, res) => {
  let UserCreate;
  try {
    const { name, email, password } = req.body;
    if (email === '' || password === '' || name === '') {
      return res.status(400).json({ error: 'All fields are required' })
    }


    const isUserExist = await usermodel.findOne({ email }).lean();;

    if (isUserExist) {
      return res.status(400).json({ error: 'User already exist with this email' })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = crypto.randomInt(100000, 999999);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // const [UserCreate] = await Promise.all([
    UserCreate = await usermodel.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires
    })

    // ])
    await sendVerificationEmail(email, otp);

    generateTokenAndSetCookie(res, UserCreate._id)



    res.status(201).json({
      message: 'Account created successfully..', user: {
        id: UserCreate._id,
        email: UserCreate.email,
        isVerified: UserCreate.isVerified,
        profileCompleted: UserCreate.profileCompleted

      }
    });

  }
  catch (err) {
    if (UserCreate && UserCreate._id) {
      await usermodel.findByIdAndDelete(UserCreate._id);
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages[0] });
    }
    res.status(500).json({ success: false, error: 'Internal server error' });
  }

}

exports.regenerateOtp = async (req, res) => {
  const { email } = req.body;

  // Validate input
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found with this email' });
    }

    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);


    // Update OTP in DB
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    await resentOtp(user.email, otp);

    return res.status(200).json({ message: 'New OTP sent to your email' });
  } catch (err) {
    console.error('Error regenerating OTP:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const user = await usermodel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }


  if (user.otp !== otp || user.otpExpires < Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP', });
  }

  try {
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;

    await user.save();

    generateTokenAndSetCookie(res, user._id)
    await sendWelcomeEmail(user.email, user.email)

    // const expirationTime = new Date();
    // expirationTime.setHours(expirationTime.getHours() + 24);

    res.status(200).json({
      message: 'Email verified successfully',
    });

  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).json({ message: 'Invalid or expired OTP' });
  }
};
exports.logout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
}
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const isUserExist = await usermodel.findOne({ email });

  if (!isUserExist) {
    return res.status(401).json({ message: 'Invalid email or password' })

  }

  const isPasswordValid = await bcrypt.compare(password, isUserExist.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  generateTokenAndSetCookie(res, isUserExist._id)
  isUserExist.lastLogin = new Date();


  await isUserExist.save();
  res.status(200).json({
    success: true, message: 'Login successful', user: {
      id: isUserExist._id,
      email: isUserExist.email,
      isVerified: isUserExist.isVerified,
      profileCompleted: isUserExist.profileCompleted

    }
  });



}
exports.google = async (req, res) => {
  const { email, name, picture } = req.body;
  if (!email || !name) {
    return res.status(400).json({ message: 'Email and name are required' });
  }

  let user = await usermodel.findOne({ email });

  if (!user) {
    const hashedPassword = await generateRandomPassword()
    user = await usermodel.create({
      email,
      name: name,
      profilePicture: picture,
      isVerified: true,
      password : hashedPassword
    });
    await sendWelcomeEmail(email , name)
  }

  generateTokenAndSetCookie(res, user._id);
  res.status(200).json({
    success: true, message: 'Login successful',user
  });




}
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' })
  }
  const user = await usermodel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found with this email' })
  }
  const resetToken = crypto.randomBytes(21).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 3600000);
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendForgotPasswordEmail(email, resetUrl)
  res.status(200).json({ message: 'Reset password link sent to your email' })

}
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required' })
  }

  const user = await usermodel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });

  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  await sendresetPasswordEmail(user.email, user.fullname);
  res.status(200).json({ message: 'Password reset successfully' });
}
exports.checkAuth = async (req, res) => {
  try {
    const user = await usermodel.findById(req.userId).select('-password -otp -otpExpires -resetPasswordToken -resetPasswordExpires')
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({ message: "User authenticated successfully", user })
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}