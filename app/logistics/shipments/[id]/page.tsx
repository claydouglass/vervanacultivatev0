// Individual shipment tracking
const ShipmentDetailPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <ShipmentTrackingMap />
      <ElproTracker />
      <ShipmentDetails />
    </div>
  );
}

export default ShipmentDetailPage; 