import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const handler = await prisma.handler.findUnique({
      where: {
        id: params.id,
      },
      include: {
        originShipments: {
          include: {
            destination: true,
            routePoints: true,
            readings: true,
          },
        },
        destinationShipments: {
          include: {
            origin: true,
            routePoints: true,
            readings: true,
          },
        },
      },
    });

    if (!handler) {
      return NextResponse.json(
        { error: 'Handler not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(handler);
  } catch (error) {
    console.error('Error fetching handler:', error);
    return NextResponse.json(
      { error: 'Error fetching handler' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const handler = await prisma.handler.update({
      where: {
        id: params.id,
      },
      data: {
        name: data.name,
        company: data.company,
        address: data.address,
        email: data.email,
        phone: data.phone,
        role: data.role,
      },
    });
    return NextResponse.json(handler);
  } catch (error) {
    console.error('Error updating handler:', error);
    return NextResponse.json(
      { error: 'Error updating handler' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.handler.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting handler:', error);
    return NextResponse.json(
      { error: 'Error deleting handler' },
      { status: 500 }
    );
  }
}
