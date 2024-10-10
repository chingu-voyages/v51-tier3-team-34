const sgMail = require('@sendgrid/mail')


module.exports = {
  sendThankYouEmail: async (user) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const mailOptions = {
      from: 'geodashworld@outlook.com', // Sender address (doesn't have to be real)
      to: user.email, // Recipient email
      subject: 'Thank You for Signing Up!',
      text: `Hi ${user.email},\n\nThank you for joining GeoDash World! We're excited to have you onboard and hope you enjoy discovering your city in a fun and creative way. We can’t wait to see what you achieve. Your support means a lot to us!
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
    }
}