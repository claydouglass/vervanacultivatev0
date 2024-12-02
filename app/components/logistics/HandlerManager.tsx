'use client';

import { useState } from 'react';
import { Handler, Shipment } from '@/types/shipment';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Truck, Package, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface HandlerDetailProps {
  handler: Handler & {
    originShipments: Shipment[];
    destinationShipments: Shipment[];
  };
}

function HandlerDetail({ handler }: HandlerDetailProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Outbound Shipments</CardTitle>
            <CardDescription>Shipments originating from this handler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {handler.originShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4" />
                    <div>
                      <div className="font-medium">To: {shipment.destination.company}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(shipment.createdAt), 'PPP')}
                      </div>
                    </div>
                  </div>
                  <div className={`
                    px-2 py-1 rounded text-sm
                    ${shipment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      shipment.status === 'alert' ? 'bg-red-100 text-red-800' :
                      shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {shipment.status}
                  </div>
                </div>
              ))}
              {handler.originShipments.length === 0 && (
                <div className="text-sm text-muted-foreground">No outbound shipments</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inbound Shipments</CardTitle>
            <CardDescription>Shipments destined for this handler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {handler.destinationShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <div>
                      <div className="font-medium">From: {shipment.origin.company}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(shipment.createdAt), 'PPP')}
                      </div>
                    </div>
                  </div>
                  <div className={`
                    px-2 py-1 rounded text-sm
                    ${shipment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      shipment.status === 'alert' ? 'bg-red-100 text-red-800' :
                      shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {shipment.status}
                  </div>
                </div>
              ))}
              {handler.destinationShipments.length === 0 && (
                <div className="text-sm text-muted-foreground">No inbound shipments</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Environmental condition alerts for this handler's shipments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...handler.originShipments, ...handler.destinationShipments]
              .filter(shipment => shipment.status === 'alert')
              .map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex items-center space-x-2 p-2 border rounded bg-red-50"
                >
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="font-medium">
                      {shipment.origin.company} → {shipment.destination.company}
                    </div>
                    <div className="text-sm text-red-600">
                      Environmental conditions outside acceptable range
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface HandlerManagerProps {
  handlers: Handler[];
  onAddHandler: (handler: Handler) => void;
  onUpdateHandler: (handler: Handler) => void;
}

export function HandlerManager({ handlers, onAddHandler, onUpdateHandler }: HandlerManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHandler, setSelectedHandler] = useState<Handler | null>(null);
  const [formData, setFormData] = useState<Partial<Handler>>({
    name: '',
    company: '',
    address: '',
    email: '',
    phone: '',
    role: 'supplier',
  });

  const handleSubmit = () => {
    if (selectedHandler) {
      onUpdateHandler({ ...selectedHandler, ...formData as Handler });
    } else {
      onAddHandler({ 
        id: Math.random().toString(36).substr(2, 9),
        ...formData as Handler 
      });
    }
    setIsOpen(false);
    setSelectedHandler(null);
    setFormData({
      name: '',
      company: '',
      address: '',
      email: '',
      phone: '',
      role: 'supplier',
    });
  };

  const startEdit = (handler: Handler) => {
    setSelectedHandler(handler);
    setFormData(handler);
    setIsOpen(true);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add New Handler
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedHandler ? 'Edit Handler' : 'Add New Handler'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company Name"
                />
              </div>
            </div>
            
            <div>
              <Label>Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full Address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email Address"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <div>
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as Handler['role'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSubmit} className="w-full">
              {selectedHandler ? 'Update Handler' : 'Add Handler'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-4 space-y-4">
        {handlers.map((handler) => (
          <Accordion key={handler.id} type="single" collapsible>
            <AccordionItem value="details">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-medium">{handler.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {handler.company} - {handler.role}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    startEdit(handler);
                  }}>
                    Edit
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <HandlerDetail handler={handler as any} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
