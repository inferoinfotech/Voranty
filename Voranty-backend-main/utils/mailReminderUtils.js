const nodemailer = require('nodemailer');
 
function sendBillReminderEmail(userEmail, billDueDate) {
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

function sendWarrentyReminderEmail(userEmail, WarrentyDueDate, warrenty) {
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
        subject: 'Upcoming Expense Due Date Reminder',
        text: `Dear User,
    
    We hope this email finds you well. This is a friendly reminder about an upcoming expense due date.
    
    Expense Details:
    - Item: ${warrenty}
    - Due Date: ${WarrentyDueDate.toDateString()}
    
    To ensure there are no disruptions or additional charges, please make arrangements to address this expense by the due date.
    
    If you have any questions or need further assistance, feel free to contact us.
    
    Best regards,  
    [Swiftrute Team- Voranty]  
    [9955112233 | Swiftrut@gmail.com]  
    [Swiftrute.com]`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = { sendBillReminderEmail, sendWarrentyReminderEmail };