import { NextResponse } from 'next/server';
import { twilioClient, isTwilioEnabled } from '@/lib/twilio';
import { staffData } from '@/app/data/staffData';
import { EnvironmentalReading } from '@/types/shipment';

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

export async function POST(request: Request) {
  try {
    const reading: EnvironmentalReading = await request.json();
    const alerts = await checkEnvironmentalExcursion(reading);
    return NextResponse.json({ success: true, alerts });
  } catch (error) {
    console.error('Error processing alert:', error);
    return NextResponse.json(
      { error: 'Failed to process alert' },
      { status: 500 }
    );
  }
}

async function checkEnvironmentalExcursion(reading: EnvironmentalReading) {
  const alerts = [];
  
  // Check temperature
  const tempAlert = await checkTemperature(reading);
  if (tempAlert) alerts.push(tempAlert);
  
  // Check humidity
  const humidityAlert = await checkHumidity(reading);
  if (humidityAlert) alerts.push(humidityAlert);
  
  return alerts;
}

async function checkTemperature(reading: EnvironmentalReading) {
  let alertLevel: 'WARNING' | 'CRITICAL' | null = null;
  
  if (reading.temperature <= THRESHOLDS.TEMP.CRITICAL_MIN_TEMP || 
      reading.temperature >= THRESHOLDS.TEMP.CRITICAL_MAX_TEMP) {
    alertLevel = 'CRITICAL';
  } else if (reading.temperature <= THRESHOLDS.TEMP.MIN_TEMP || 
             reading.temperature >= THRESHOLDS.TEMP.MAX_TEMP) {
    alertLevel = 'WARNING';
  }

  if (alertLevel) {
    const message = `TEMPERATURE ${alertLevel} at ${reading.location.latitude}, ${reading.location.longitude}: ${reading.temperature}°C at ${reading.timestamp.toLocaleString()}`;
    await sendAlerts(message, alertLevel);
    return { type: 'TEMPERATURE', level: alertLevel, message };
  }
  
  return null;
}

async function checkHumidity(reading: EnvironmentalReading) {
  let alertLevel: 'WARNING' | 'CRITICAL' | null = null;
  
  if (reading.humidity <= THRESHOLDS.HUMIDITY.CRITICAL_MIN_RH || 
      reading.humidity >= THRESHOLDS.HUMIDITY.CRITICAL_MAX_RH) {
    alertLevel = 'CRITICAL';
  } else if (reading.humidity <= THRESHOLDS.HUMIDITY.MIN_RH || 
             reading.humidity >= THRESHOLDS.HUMIDITY.MAX_RH) {
    alertLevel = 'WARNING';
  }

  if (alertLevel) {
    const message = `HUMIDITY ${alertLevel} at ${reading.location.latitude}, ${reading.location.longitude}: ${reading.humidity}%RH at ${reading.timestamp.toLocaleString()}`;
    await sendAlerts(message, alertLevel);
    return { type: 'HUMIDITY', level: alertLevel, message };
  }
  
  return null;
}

async function sendAlerts(message: string, level: 'WARNING' | 'CRITICAL') {
  // If Twilio is not configured, just log the alerts
  if (!isTwilioEnabled) {
    console.log(`[ALERT] ${level}: ${message}`);
    return;
  }

  const recipientsToNotify = staffData.filter(staff => 
    staff.alertPreference === 'ALL' || 
    (staff.alertPreference === 'CRITICAL_ONLY' && level === 'CRITICAL')
  );

  for (const staff of recipientsToNotify) {
    try {
      await twilioClient?.messages.create({
        body: message,
        to: staff.phone,
        from: process.env.TWILIO_PHONE_NUMBER
      });
    } catch (error) {
      console.error(`Failed to send SMS to ${staff.phone}:`, error);
    }
  }
}
