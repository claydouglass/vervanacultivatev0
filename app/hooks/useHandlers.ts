import { useState, useEffect } from 'react';
import { Handler } from '@/types/shipment';

export function useHandlers() {
  const [handlers, setHandlers] = useState<Handler[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHandlers = async () => {
    try {
      const response = await fetch('/api/handlers');
      if (!response.ok) {
        throw new Error('Failed to fetch handlers');
      }
      const data = await response.json();
      setHandlers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch handlers');
    } finally {
      setLoading(false);
    }
  };

  const addHandler = async (handler: Omit<Handler, 'id'>) => {
    try {
      const response = await fetch('/api/handlers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(handler),
      });

      if (!response.ok) {
        throw new Error('Failed to add handler');
      }

      const newHandler = await response.json();
      setHandlers([...handlers, newHandler]);
      return newHandler;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add handler');
      throw err;
    }
  };

  const updateHandler = async (handler: Handler) => {
    try {
      const response = await fetch(`/api/handlers/${handler.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(handler),
      });

      if (!response.ok) {
        throw new Error('Failed to update handler');
      }

      const updatedHandler = await response.json();
      setHandlers(handlers.map(h => h.id === updatedHandler.id ? updatedHandler : h));
      return updatedHandler;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update handler');
      throw err;
    }
  };

  const deleteHandler = async (id: string) => {
    try {
      const response = await fetch(`/api/handlers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete handler');
      }

      setHandlers(handlers.filter(h => h.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete handler');
      throw err;
    }
  };

  const getHandlerWithShipments = async (id: string) => {
    try {
      const response = await fetch(`/api/handlers/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch handler details');
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch handler details');
      throw err;
    }
  };

  useEffect(() => {
    fetchHandlers();
  }, []);

  return {
    handlers,
    loading,
    error,
    addHandler,
    updateHandler,
    deleteHandler,
    getHandlerWithShipments,
    refreshHandlers: fetchHandlers,
  };
}
