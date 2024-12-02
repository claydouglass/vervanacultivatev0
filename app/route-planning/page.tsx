'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoutePlanner } from '../components/logistics/RoutePlanner';
import { RouteSummary } from '../components/logistics/RouteSummary';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Search, Clock, Copy, Trash2, FolderOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dynamic from 'next/dynamic';
import { RoutePoint } from '@/types/shipment';

// Dynamically import the map component to avoid SSR issues
const RouteMap = dynamic(() => import('../components/logistics/RouteMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-muted animate-pulse flex items-center justify-center">
      Loading map...
    </div>
  ),
});

interface Route {
  id: string;
  name: string;
  stops: RoutePoint[];
  created_at: string;
}

export default function RoutePlanningPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/routes');
      if (!response.ok) throw new Error('Failed to fetch routes');
      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch routes",
        variant: "destructive",
      });
    }
  };

  const handleSaveRoute = async (route: { name: string; stops: RoutePoint[] }) => {
    try {
      const method = selectedRoute ? 'PUT' : 'POST';
      const url = selectedRoute ? `/api/routes?id=${selectedRoute.id}` : '/api/routes';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(route),
      });

      if (!response.ok) throw new Error('Failed to save route');
      
      await fetchRoutes();
      toast({
        title: "Success",
        description: `Route ${selectedRoute ? 'updated' : 'saved'} successfully`,
      });
    } catch (error) {
      console.error('Error saving route:', error);
      toast({
        title: "Error",
        description: "Failed to save route",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateRoute = async (route: Route) => {
    try {
      const newRoute = {
        name: `${route.name} (Copy)`,
        stops: route.stops,
      };

      const response = await fetch('/api/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoute),
      });

      if (!response.ok) throw new Error('Failed to duplicate route');

      await fetchRoutes();
      toast({
        title: "Success",
        description: "Route duplicated successfully",
      });
    } catch (error) {
      console.error('Error duplicating route:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate route",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoute = async (route: Route) => {
    try {
      const response = await fetch(`/api/routes?id=${route.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete route');

      if (selectedRoute?.id === route.id) {
        setSelectedRoute(null);
      }
      
      await fetchRoutes();
      toast({
        title: "Success",
        description: "Route deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting route:', error);
      toast({
        title: "Error",
        description: "Failed to delete route",
        variant: "destructive",
      });
    }
  };

  const filteredRoutes = routes.filter(route => 
    route.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Route Planner</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" size="sm" className="text-sm">
              <FolderOpen className="h-4 w-4 mr-1" />
              Saved Routes
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Saved Routes</DialogTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search routes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 text-sm"
                />
              </div>
            </DialogHeader>
            <div className="space-y-1 max-h-[60vh] overflow-y-auto">
              {filteredRoutes.map((route) => (
                <div
                  key={route.id}
                  className={`p-2 rounded-lg cursor-pointer flex items-center justify-between text-sm group ${
                    selectedRoute?.id === route.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => {
                    setSelectedRoute(route);
                    document.querySelector('[data-dialog-close]')?.click();
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{route.name}</p>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {route.stops.length} stops
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateRoute(route);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Route</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete "{route.name}"? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteRoute(route)}
                          >
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Route Planner Content */}
      <Card>
        <CardContent className="pt-6">
          <RoutePlanner
            initialRoute={selectedRoute}
            onSave={handleSaveRoute}
          />
        </CardContent>
      </Card>
    </div>
  );
}
