const nodemailer = require('nodemailer');


module_exports = {
    sendThankYouEmail: async (user) => {
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "33f78c878d2848",
                pass: "********03ba",
            },
        });
        
        console.log(user)
        console.log(user.email)
        const mailOptions = {
          from: 'support@geodashworld.com', // Sender address (doesn't have to be real)
          to: user.email, // Recipient email
          subject: 'Thank You for Signing Up!',
          text: `Hi ${user.email},\n\nThank you for signing up to our service! We're excited to have you onboard.\n\nBest regards,\nThe Team`,
        };
      
        try {
          await transporter.sendMail(mailOptions);
          console.log('Thank you email sent');
        } catch (error) {
          console.error('Error sending email:', error);
        }
      }
}