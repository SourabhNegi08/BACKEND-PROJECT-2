require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
}); 

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, userName) {
    
    const subject = 'Welcome to Our Service!';
    const text = `Hello ${userName},\n\nThank you for registering with our service! We're excited to have you on board.\n\nBest regards,\nThe Team`;
    const html = `<p>Hello ${userName},</p><p>Thank you for registering with our service! We're excited to have you on board.</p><p>Best regards,<br>The Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}
async function sendTransactionEmail(userEmail, userName, transactionDetails) {
    const subject = 'Transaction Notification';
    const text = `Hello ${userName},\n\nYour transaction has been processed successfully. Here are the details:\n\nTransaction ID: ${transactionDetails.id}\nAmount: ${transactionDetails.amount}\nStatus: ${transactionDetails.status}\n\nThank you for using our service!\n\nBest regards,\nThe Team`;

    const html = `<p>Hello ${userName},</p><p>Your transaction has been processed successfully. Here are the details:</p><ul><li>Transaction ID: ${transactionDetails.id}</li><li>Amount: ${transactionDetails.amount}</li><li>Status: ${transactionDetails.status}</li></ul><p>Thank you for using our service!</p><p>Best regards,<br>The Team</p>`;
    await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendRegistrationEmail, sendTransactionEmail };