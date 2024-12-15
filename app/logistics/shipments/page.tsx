// Overview of all shipments
import { ShipmentsTable } from '@/app/components/logistics/ShipmentsTable';
import Link from 'next/link';

const ShipmentsPage = () => {
  return (
    <div>
      <ShipmentsTable /> {/* List all shipments */}
      <Link href="/logistics/shipments/new">Create New Shipment</Link>
    </div>
  );
}

export default ShipmentsPage; 