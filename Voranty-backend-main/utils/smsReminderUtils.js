const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

module.exports.sendBillReminderSMS = async (phoneNumber, dueDate) => {
  try {
    const message = `Reminder: Your bill is due tomorrow. Due date: ${dueDate.toDateString()}`;
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_ACCOUNT_NUMBER,
      to: phoneNumber,
    });

    console.log(`SMS sent to ${phoneNumber}: ${response.sid}`);
    return response.sid;
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    throw new Error("Failed to send SMS reminder");
  }
};

module.exports.sendWarrentyReminderSMS = async (phoneNumber, WarrentyDueDate, warrenty) => {
  try {
    const message = `Reminder: Your Warrenty is due tomorrow. Your Warrenty is ${warrenty} & Due date: ${WarrentyDueDate.toDateString()}`;
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_ACCOUNT_NUMBER,
      to: phoneNumber,
    });

    console.log(`SMS sent to ${phoneNumber}: ${response.sid}`);
    return response.sid;
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    throw new Error("Failed to send SMS reminder");
  }
}; 
