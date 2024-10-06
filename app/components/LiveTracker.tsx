import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  product: string;
  batch: string;
  shippingPartner: string;
};

const LiveTracker: React.FC<Props> = ({ product, batch, shippingPartner }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Live Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Product: {product}</p>
        <p>Batch: {batch}</p>
        <p>Shipping Partner: {shippingPartner}</p>
        {/* Add more content here */}
      </CardContent>
    </Card>
  );
};

export default LiveTracker;