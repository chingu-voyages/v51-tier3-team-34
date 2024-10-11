const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const frontendURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5173'
  : process.env.VITE_FRONTEND_URI;

module.exports = {
  sendThankYouEmail: async (user) => {

    const mailOptions = {
      from: 'geodashworld@outlook.com', // Sender address (doesn't have to be real)
      to: user.email, // Recipient email
      subject: 'Thank You for Signing Up!',
      text: `Hi ${user.name},\n\nThank you for joining GeoDash World! We're excited to have you onboard and hope you enjoy discovering your city in a fun and creative way. We can’t wait to see what you achieve. Your support means a lot to us!
        \n
        \nBest regards,
        \nThe GeoDash World Team`,
    };

    try {
      await sgMail.send(mailOptions)
      console.log('Thank you email sent');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  },

  sendResetEmail: async(email, token) => {

    const mailOptions = {
      from: 'geodashworld@outlook.com', // Sender address (doesn't have to be real)
      to: email, // Recipient email
      subject: 'Reset Password',
      text: `Reset Your Password 
        \n
        \n Click on the following link to reset your password:
        \n ${frontendURL}/reset/${token}
        \n
        \n The link will expire in 30 minutes.
        \n
        \n If you didn't request a password reset, please ignore this email.
        \n
        \n Best regards,
        \n The GeoDash World Team`,
    };

    try {
      await sgMail.send(mailOptions)
      console.log('Reset email sent');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

}