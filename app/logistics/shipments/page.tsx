// Overview of all shipments
const ShipmentsPage = () => {
  return (
    <div>
      <ShipmentsTable /> {/* List all shipments */}
      <Link href="/logistics/shipments/new">Create New Shipment</Link>
    </div>
  );
}

export default ShipmentsPage; 