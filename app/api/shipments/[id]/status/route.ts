import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ShipmentStatus } from '@/types/shipment';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id: params.id },
      include: {
        route: {
          include: {
            handler: true,
            location: true,
          }
        },
        actualReadings: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
        actualLocations: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
        timeline: {
          include: {
            location: true,
          },
          orderBy: { timestamp: 'desc' },
        }
      }
    });

    if (!shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    const currentLocation = shipment.actualLocations[0];
    const latestReading = shipment.actualReadings[0];
    const completedStops = shipment.timeline.filter(t => t.actualTime !== null).length;
    const totalStops = shipment.route.length;

    // Calculate time progress
    const startTime = shipment.startTime;
    const endTime = shipment.estimatedEndTime;
    const now = new Date();
    const totalDuration = endTime.getTime() - startTime.getTime();
    const elapsedDuration = now.getTime() - startTime.getTime();
    const timeProgress = Math.min(100, (elapsedDuration / totalDuration) * 100);

    // Calculate if ahead of schedule
    const expectedProgress = (elapsedDuration / totalDuration) * 100;
    const isAheadOfSchedule = (completedStops / totalStops) * 100 > expectedProgress;

    const status: ShipmentStatus = {
      status: shipment.status,
      message: getStatusMessage(shipment.status),
      lastUpdate: latestReading?.timestamp || currentLocation?.timestamp || new Date(),
      currentLocation: currentLocation?.location,
      environmentalConditions: {
        temperature: {
          current: latestReading?.temperature || 0,
          min: 15,
          max: 25,
          target: 20,
        },
        humidity: {
          current: latestReading?.humidity || 0,
          min: 30,
          max: 60,
          target: 45,
        },
        lastReading: latestReading?.timestamp || new Date(),
        isWithinLimits: checkEnvironmentalLimits(latestReading),
      },
      routeProgress: {
        completedStops,
        totalStops,
        timeProgress,
        distanceProgress: (completedStops / totalStops) * 100,
        isAheadOfSchedule,
      },
      currentHandler: getCurrentHandler(shipment),
      nextHandler: getNextHandler(shipment),
      timeline: {
        past: shipment.timeline
          .filter(t => t.actualTime !== null)
          .map(t => ({
            location: t.location,
            event: t.event,
            plannedTime: t.plannedTime,
            actualTime: t.actualTime!,
            variance: getTimeVariance(t.plannedTime, t.actualTime!),
          })),
        upcoming: shipment.timeline
          .filter(t => t.actualTime === null)
          .map(t => ({
            location: t.location,
            expectedTime: calculateExpectedTime(t.plannedTime, timeProgress),
            plannedTime: t.plannedTime,
            event: t.event,
          })),
      },
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching shipment status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case 'on_track':
      return 'Shipment is proceeding as planned';
    case 'delayed':
      return 'Shipment is experiencing delays';
    case 'warning':
      return 'Environmental conditions require attention';
    case 'alert':
      return 'Critical environmental conditions detected';
    default:
      return 'Status unknown';
  }
}

function checkEnvironmentalLimits(reading: any): boolean {
  if (!reading) return true;
  return (
    reading.temperature >= 15 &&
    reading.temperature <= 25 &&
    reading.humidity >= 30 &&
    reading.humidity <= 60
  );
}

function getCurrentHandler(shipment: any) {
  const currentStop = shipment.timeline
    .filter((t: any) => t.actualTime !== null)
    .sort((a: any, b: any) => b.actualTime.getTime() - a.actualTime.getTime())[0];
  
  return currentStop?.handler;
}

function getNextHandler(shipment: any) {
  const nextStop = shipment.timeline
    .filter((t: any) => t.actualTime === null)
    .sort((a: any, b: any) => a.plannedTime.getTime() - b.plannedTime.getTime())[0];
  
  return nextStop?.handler;
}

function getTimeVariance(planned: Date, actual: Date): number {
  return Math.round((actual.getTime() - planned.getTime()) / (1000 * 60)); // minutes
}

function calculateExpectedTime(planned: Date, progress: number): Date {
  const now = new Date();
  const delay = progress > 100 ? (progress - 100) * 0.01 : 0; // Add delay if behind schedule
  return new Date(planned.getTime() + delay * 60 * 60 * 1000);
}
