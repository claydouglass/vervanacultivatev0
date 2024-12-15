'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Mail, Phone, Globe, Edit, Trash2, Share2, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/lib/supabase';
import { BusinessPartner, PartnerContact, PartnerType } from '@/types/partner';

const PARTNER_TYPES: PartnerType[] = ['LOGISTICS', 'IMPORTER', 'CUSTOMS', 'REFINER', 'DISTRIBUTOR', 'RETAILER'];

export default function PartnersPage() {
  const [partners, setPartners] = useState<BusinessPartner[]>([]);
  const [contacts, setContacts] = useState<PartnerContact[]>([]);
  const [selectedType, setSelectedType] = useState<PartnerType>('LOGISTICS');
  const [newPartner, setNewPartner] = useState({
    name: '',
    website: '',
    type: [] as PartnerType[],
    notes: ''
  });
  const [newContact, setNewContact] = useState({
    partner_id: '',
    name: '',
    role: '',
    email: '',
    phone: '',
    is_primary: false
  });
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [showShareAccess, setShowShareAccess] = useState(false);

  useEffect(() => {
    fetchPartners();
    fetchContacts();
  }, []);

  const fetchPartners = async () => {
    const { data, error } = await supabase
      .from('business_partners')
      .select('*')
      .order('name');
    
    if (data) setPartners(data);
    if (error) console.error('Error fetching partners:', error);
  };

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('partner_contacts')
      .select('*')
      .order('name');
    
    if (data) setContacts(data);
    if (error) console.error('Error fetching contacts:', error);
  };

  const handleAddPartner = async () => {
    const { error } = await supabase
      .from('business_partners')
      .insert([newPartner]);

    if (error) {
      console.error('Error adding partner:', error);
    } else {
      setShowAddPartner(false);
      setNewPartner({ name: '', website: '', type: [], notes: '' });
      fetchPartners();
    }
  };

  const handleAddContact = async () => {
    const { error } = await supabase
      .from('partner_contacts')
      .insert([newContact]);

    if (error) {
      console.error('Error adding contact:', error);
    } else {
      setShowAddContact(false);
      setNewContact({
        partner_id: '',
        name: '',
        role: '',
        email: '',
        phone: '',
        is_primary: false
      });
      fetchContacts();
    }
  };

  const filteredPartners = partners.filter(partner => 
    partner.type.includes(selectedType)
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Supply Chain Partners</h1>
        <Button onClick={() => setShowAddPartner(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      <Tabs defaultValue="LOGISTICS" className="mb-6">
        <TabsList>
          {PARTNER_TYPES.map(type => (
            <TabsTrigger
              key={type}
              value={type}
              onClick={() => setSelectedType(type)}
            >
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </TabsTrigger>
          ))}
        </TabsList>

        {PARTNER_TYPES.map(type => (
          <TabsContent key={type} value={type}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPartners.map(partner => (
                <Card key={partner.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{partner.name}</span>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {partner.type.map(t => (
                        <Badge key={t} variant="secondary">
                          {t.charAt(0) + t.slice(1).toLowerCase()}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-gray-500 mb-4"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        {partner.website}
                      </a>
                    )}

                    {partner.notes && (
                      <p className="text-sm text-gray-500 mb-4">{partner.notes}</p>
                    )}

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Contacts</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPartner(partner.id);
                            setNewContact(prev => ({ ...prev, partner_id: partner.id }));
                            setShowAddContact(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Contact
                        </Button>
                      </div>

                      {contacts
                        .filter(contact => contact.partner_id === partner.id)
                        .map(contact => (
                          <div
                            key={contact.id}
                            className="p-4 border rounded-lg space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium flex items-center">
                                  {contact.name}
                                  {contact.is_primary && (
                                    <Star className="w-4 h-4 ml-2 text-yellow-500" />
                                  )}
                                </h4>
                                {contact.role && (
                                  <p className="text-sm text-gray-500">{contact.role}</p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedPartner(partner.id);
                                  setSelectedContact(contact.id);
                                  setShowShareAccess(true);
                                }}
                              >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share Access
                              </Button>
                            </div>
                            
                            <div className="flex flex-col space-y-1">
                              <a
                                href={`mailto:${contact.email}`}
                                className="flex items-center text-sm text-gray-500"
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                {contact.email}
                              </a>
                              {contact.phone && (
                                <a
                                  href={`tel:${contact.phone}`}
                                  className="flex items-center text-sm text-gray-500"
                                >
                                  <Phone className="w-4 h-4 mr-2" />
                                  {contact.phone}
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Partner Dialog */}
      <Dialog open={showAddPartner} onOpenChange={setShowAddPartner}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Partner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="partner-name">Partner Name</Label>
              <Input
                id="partner-name"
                value={newPartner.name}
                onChange={e => setNewPartner(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="partner-website">Website</Label>
              <Input
                id="partner-website"
                value={newPartner.website}
                onChange={e => setNewPartner(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
            <div>
              <Label>Partner Types</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {PARTNER_TYPES.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={newPartner.type.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewPartner(prev => ({
                            ...prev,
                            type: [...prev.type, type]
                          }));
                        } else {
                          setNewPartner(prev => ({
                            ...prev,
                            type: prev.type.filter(t => t !== type)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={`type-${type}`}>{type.charAt(0) + type.slice(1).toLowerCase()}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="partner-notes">Notes</Label>
              <Input
                id="partner-notes"
                value={newPartner.notes}
                onChange={e => setNewPartner(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            <Button onClick={handleAddPartner}>Add Partner</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Contact Dialog */}
      <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                value={newContact.name}
                onChange={e => setNewContact(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="contact-role">Role</Label>
              <Input
                id="contact-role"
                value={newContact.role}
                onChange={e => setNewContact(prev => ({ ...prev, role: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={newContact.email}
                onChange={e => setNewContact(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="contact-phone">Phone</Label>
              <Input
                id="contact-phone"
                type="tel"
                value={newContact.phone}
                onChange={e => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="contact-primary"
                checked={newContact.is_primary}
                onCheckedChange={(checked) => 
                  setNewContact(prev => ({ ...prev, is_primary: checked as boolean }))
                }
              />
              <Label htmlFor="contact-primary">Primary Contact</Label>
            </div>
            <Button onClick={handleAddContact}>Add Contact</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Access Dialog */}
      <Dialog open={showShareAccess} onOpenChange={setShowShareAccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Access</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              This will generate a secure link that allows the contact to view shipment tracking data
              and receive relevant notifications. The link will expire in 30 days.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notify-temperature"
                  defaultChecked
                />
                <Label htmlFor="notify-temperature">Temperature Excursion Alerts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notify-humidity"
                  defaultChecked
                />
                <Label htmlFor="notify-humidity">Humidity Excursion Alerts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notify-location"
                  defaultChecked
                />
                <Label htmlFor="notify-location">Location Updates</Label>
              </div>
            </div>
            <Button
              onClick={async () => {
                if (selectedPartner && selectedContact) {
                  try {
                    const response = await fetch('/api/partners/access', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        partnerId: selectedPartner,
                        contactId: selectedContact,
                        accessLevel: 'read',
                        notifications: {
                          temperature: true,
                          humidity: true,
                          location: true
                        }
                      }),
                    });

                    if (!response.ok) {
                      throw new Error('Failed to share access');
                    }

                    setShowShareAccess(false);
                    // Show success message
                  } catch (error) {
                    console.error('Error sharing access:', error);
                    // Show error message
                  }
                }
              }}
            >
              Generate Access Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
