const nodemailer = require('nodemailer');
    
function sendReminderEmail(userEmail, billDueDate) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Reminder: Bill Due Tomorrow',
        text: `This is a reminder that your bill is due on ${billDueDate}. Please make sure to pay it on time.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = { sendReminderEmail };
