require('dotenv').config();
const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
// Clean password just like in index.js
const emailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

console.log('Testing Email Configuration:');
console.log('User:', emailUser);
console.log('Pass Length:', emailPass ? emailPass.length : 0);

if (!emailUser || !emailPass) {
    console.error('❌ Missing EMAIL_USER or EMAIL_PASS in .env');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass
    },
    tls: {
        rejectUnauthorized: false
    }
});

const mailOptions = {
    from: emailUser,
    to: emailUser, // Send to self
    subject: 'Test Email from Debug Script',
    text: 'If you receive this, the Nodemailer configuration works.'
};

console.log('Attempting to send email...');

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('❌ Error sending email:', error);
    } else {
        console.log('✅ Email sent successfully:', info.response);
    }
});
