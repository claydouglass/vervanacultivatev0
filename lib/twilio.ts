import twilio from 'twilio';

// Only initialize Twilio if credentials are present
export const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export const isTwilioEnabled = !!twilioClient;
