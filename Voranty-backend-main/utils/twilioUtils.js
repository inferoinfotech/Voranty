const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_ACCOUNT_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Send an SMS message
  @param {string} to = MY_PHONE_NUMBER
 * @param {string} message - Message content
 */
const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to,
    });

    console.log("SMS sent successfully:", response.sid);
    return response;
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    throw error;
  }
};

module.exports = { sendSMS };
