import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  product: string;
  batch: string;
  location: string;
};

const ExportLicenses: React.FC<Props> = ({ product, batch, location }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Export Licenses</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Product: {product}</p>
        <p>Batch: {batch}</p>
        <p>Location: {location}</p>
        {/* Add more content here */}
      </CardContent>
    </Card>
  );
};

export default ExportLicenses;