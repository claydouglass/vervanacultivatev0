'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

export default function ElproTest() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function testElproConnection() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/logistics/elpro');
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        console.log('Elpro API Response:', data);
        setData(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    testElproConnection();
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Elpro API Test</h2>
      
      {isLoading && <p>Testing connection...</p>}
      
      {error && (
        <div className="text-red-500">
          <p>Error connecting to Elpro API:</p>
          <p>{error}</p>
        </div>
      )}
      
      {data && (
        <div>
          <p>Connection successful!</p>
          <pre className="bg-gray-100 p-4 mt-2 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </Card>
  );
} 