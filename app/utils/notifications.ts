import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS(phone: string, message: string) {
  try {
    const response = await client.messages.create({
      body: message,
      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
    console.log('SMS sent successfully:', response.sid);
    return response;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw error;
  }
} 