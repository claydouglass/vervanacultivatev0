import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

interface AccessRequest {
  companyId: string;
  contactId: string;
  shipmentId: string;
  accessLevel: 'read' | 'write';
  notifications: {
    temperature: boolean;
    humidity: boolean;
    location: boolean;
  };
}

export async function POST(request: Request) {
  try {
    const { companyId, contactId, shipmentId, accessLevel, notifications }: AccessRequest = await request.json();

    // Create access record
    const { data: access, error: accessError } = await supabase
      .from('logistics_access')
      .insert({
        company_id: companyId,
        contact_id: contactId,
        access_level: accessLevel,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      })
      .select()
      .single();

    if (accessError) {
      console.error('Error creating access:', accessError);
      return NextResponse.json(
        { error: 'Failed to create access' },
        { status: 500 }
      );
    }

    // Get contact details
    const { data: contact, error: contactError } = await supabase
      .from('logistics_contacts')
      .select('email, name')
      .eq('id', contactId)
      .single();

    if (contactError) {
      console.error('Error fetching contact:', contactError);
      return NextResponse.json(
        { error: 'Failed to fetch contact details' },
        { status: 500 }
      );
    }

    // Create magic link for the contact
    const { data: magicLink, error: magicLinkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: contact.email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/shipments/${shipmentId}`,
        data: {
          companyId,
          shipmentId,
          accessLevel,
          notifications,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        }
      },
    });

    if (magicLinkError) {
      console.error('Error generating magic link:', magicLinkError);
      return NextResponse.json(
        { error: 'Failed to generate access link' },
        { status: 500 }
      );
    }

    // Store access preferences
    const { error: prefsError } = await supabase
      .from('logistics_preferences')
      .upsert({
        company_id: companyId,
        contact_id: contactId,
        shipment_id: shipmentId,
        notifications_config: notifications,
        access_level: accessLevel,
        last_access: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      });

    if (prefsError) {
      console.error('Error storing preferences:', prefsError);
      // Continue anyway as this is not critical
    }

    return NextResponse.json({
      success: true,
      magicLink: magicLink.properties.action_link,
      message: 'Access shared successfully'
    });
  } catch (error) {
    console.error('Error sharing access:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
