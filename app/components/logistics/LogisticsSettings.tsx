'use client';

import { useState } from 'react';
import { Handler } from '@/types/shipment';
import { Button } from "@/components/ui/button";
import { HandlerManager } from './HandlerManager';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Settings } from 'lucide-react';

interface LogisticsSettingsProps {
  handlers: Handler[];
  onUpdateHandlers: (handlers: Handler[]) => void;
}

export function LogisticsSettings({ handlers, onUpdateHandlers }: LogisticsSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddHandler = (handler: Handler) => {
    onUpdateHandlers([...handlers, handler]);
  };

  const handleUpdateHandler = (updatedHandler: Handler) => {
    onUpdateHandlers(
      handlers.map(h => h.id === updatedHandler.id ? updatedHandler : h)
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Logistics Settings</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="handlers">
              <AccordionTrigger>Handlers Management</AccordionTrigger>
              <AccordionContent>
                <HandlerManager
                  handlers={handlers}
                  onAddHandler={handleAddHandler}
                  onUpdateHandler={handleUpdateHandler}
                />
              </AccordionContent>
            </AccordionItem>
            
            {/* Add more settings sections here */}
            <AccordionItem value="preferences">
              <AccordionTrigger>Preferences</AccordionTrigger>
              <AccordionContent>
                {/* Add preferences settings here */}
                <div className="text-sm text-muted-foreground">
                  Additional logistics preferences will be added here.
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
