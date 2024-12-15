# Vervana Cultivate

Vervana Cultivate is a comprehensive logistics tracking and environmental monitoring platform built with Next.js 14. It provides real-time shipment tracking, environmental condition monitoring, and interactive mapping capabilities.

## Features

- **Shipment Tracking**: Real-time tracking of shipments with detailed status updates
- **Environmental Monitoring**: Temperature and humidity tracking with target ranges
- **Interactive Mapping**: Real-time route visualization using Google Maps
- **Progress Analytics**: Compare actual vs. planned metrics for routes and schedules
- **Handler Management**: Track and contact current and upcoming shipment handlers

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vervana-cultivate.git
cd vervana-cultivate
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the following:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_map_id
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3010](http://localhost:3010) to view the application.

## Project Structure

```
vervana-cultivate/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── components/        # Shared components
│   ├── logistics/         # Logistics tracking pages
│   └── utils/            # Utility functions
├── components/            # UI components
├── types/                # TypeScript type definitions
└── public/              # Static assets
```

## Documentation

- [Components](./docs/components.md) - Detailed component documentation
- [API Routes](./docs/api-routes.md) - API endpoint documentation
- [Environmental Monitoring](./docs/environmental.md) - Environmental tracking system
- [Deployment](./docs/deployment.md) - Deployment guide

## Progress Summary

### Completed Features
- Basic shipment tracking interface
- Environmental monitoring charts
- Interactive Google Maps integration
- Shipment details page with progress comparison
- Real-time data visualization components

### Next Steps
1. Implement real-time data fetching from backend
2. Add authentication and authorization
3. Enhance route tracking features
4. Develop comprehensive logging system
5. Create detailed handler interaction features

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Maps**: Google Maps API
- **Charts**: Chart.js
- **Icons**: Lucide React

## Contributing

Please read our [Contributing Guide](./docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
