import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  product: string;
  batch: string;
};

const BatchAvailability: React.FC<Props> = ({ product, batch }) => {
  // Mock data - replace with actual API call
  const availabilityDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Batch Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Product: {product}</p>
        <p>Batch: {batch}</p>
        <p>Estimated Availability Date: {availabilityDate}</p>
      </CardContent>
    </Card>
  );
};

export default BatchAvailability;