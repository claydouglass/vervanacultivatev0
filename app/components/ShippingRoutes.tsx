import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  product: string;
  batch: string;
  location: string;
  shippingPartner: string;
  buyer: string;
};

const ShippingRoutes: React.FC<Props> = ({ product, batch, location, shippingPartner, buyer }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Shipping Routes</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Product: {product}</p>
        <p>Batch: {batch}</p>
        <p>Location: {location}</p>
        <p>Shipping Partner: {shippingPartner}</p>
        <p>Buyer: {buyer}</p>
        {/* Add more content here */}
      </CardContent>
    </Card>
  );
};

export default ShippingRoutes;