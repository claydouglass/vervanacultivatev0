'use client';

import ShipmentTrackingMap from '@/app/components/logistics/ShipmentTrackingMap';
import ElproTracker from '@/app/components/logistics/ElproTracker';
import { ShipmentDetails } from '@/app/components/logistics/ShipmentDetails';
import { CultivationProgress } from '@/app/components/CultivationProgress';

export default function ShipmentDetailPage({ params }: { params: { id?: string } }) {
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Main shipment details and status */}
        <div className="col-span-1">
          <ShipmentDetails shipmentId={params.id} />
        </div>
        
        {/* Map and environmental data side by side on larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="col-span-1">
            <ShipmentTrackingMap shipmentId={params.id} />
          </div>
          <div className="col-span-1">
            <ElproTracker shipmentId={params.id} />
          </div>
        </div>

        {/* Cultivation Progress Photos */}
        <div className="col-span-1">
          <CultivationProgress />
        </div>
      </div>
    </div>
  );
}