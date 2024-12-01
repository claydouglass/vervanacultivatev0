import twilio from 'twilio';
import { staffData } from '../staff/page';
import { sendSMS } from './notifications';

// Define environmental threshold constants
const THRESHOLDS = {
  TEMP: {
    MIN_TEMP: 15,  // °C
    MAX_TEMP: 25,  // °C
    CRITICAL_MIN_TEMP: 10,  // °C
    CRITICAL_MAX_TEMP: 30, // °C
  },
  HUMIDITY: {
    MIN_RH: 30,  // %RH (Warning level)
    MAX_RH: 60,  // %RH (Warning level)
    CRITICAL_MIN_RH: 20,  // %RH
    CRITICAL_MAX_RH: 70,  // %RH
  }
};

type AlertLevel = 'WARNING' | 'CRITICAL';
type AlertType = 'TEMPERATURE' | 'HUMIDITY';

interface EnvironmentalReading {
  timestamp: Date;
  temperature: number;
  humidity: number;
  location: string;
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function checkEnvironmentalExcursion(reading: EnvironmentalReading) {
  // Check temperature
  await checkTemperature(reading);
  // Check humidity
  await checkHumidity(reading);
}

async function checkTemperature(reading: EnvironmentalReading) {
  let alertLevel: AlertLevel | null = null;
  
  if (reading.temperature <= THRESHOLDS.TEMP.CRITICAL_MIN_TEMP || 
      reading.temperature >= THRESHOLDS.TEMP.CRITICAL_MAX_TEMP) {
    alertLevel = 'CRITICAL';
  } else if (reading.temperature <= THRESHOLDS.TEMP.MIN_TEMP || 
             reading.temperature >= THRESHOLDS.TEMP.MAX_TEMP) {
    alertLevel = 'WARNING';
  }

  if (alertLevel) {
    await sendAlerts(reading, alertLevel, 'TEMPERATURE');
  }
}

async function checkHumidity(reading: EnvironmentalReading) {
  let alertLevel: AlertLevel | null = null;
  
  if (reading.humidity <= THRESHOLDS.HUMIDITY.CRITICAL_MIN_RH || 
      reading.humidity >= THRESHOLDS.HUMIDITY.CRITICAL_MAX_RH) {
    alertLevel = 'CRITICAL';
  } else if (reading.humidity <= THRESHOLDS.HUMIDITY.MIN_RH || 
             reading.humidity >= THRESHOLDS.HUMIDITY.MAX_RH) {
    alertLevel = 'WARNING';
  }

  if (alertLevel) {
    await sendAlerts(reading, alertLevel, 'HUMIDITY');
  }
}

async function sendAlerts(reading: EnvironmentalReading, level: AlertLevel, type: AlertType) {
  const parameter = type === 'TEMPERATURE' ? `${reading.temperature}°C` : `${reading.humidity}%RH`;
  const message = `${type} ${level} at ${reading.location}: ${parameter} at ${reading.timestamp.toLocaleString()}`;
  
  const recipientsToNotify = staffData.filter(staff => 
    staff.alertPreference === 'ALL' || 
    (staff.alertPreference === 'CRITICAL_ONLY' && level === 'CRITICAL')
  );

  for (const staff of recipientsToNotify) {
    await sendSMS(staff.phone, message);
  }
} 