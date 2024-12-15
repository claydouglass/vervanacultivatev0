'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CultivationPhoto {
  id: string;
  day: number;
  url: string;
  description: string;
}

const mockPhotos: CultivationPhoto[] = [
  {
    id: '1',
    day: 10,
    url: '/Day 10.jpg',
    description: 'Early stage cultivation - Day 10'
  },
  {
    id: '2',
    day: 40,
    url: '/Day 40.jpg',
    description: 'Mid stage cultivation - Day 40'
  },
  {
    id: '3',
    day: 50,
    url: '/Day 50.jpg',
    description: 'Late stage cultivation - Day 50'
  }
];

export function CultivationProgress() {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const currentPhoto = mockPhotos[selectedPhotoIndex];

  const nextPhoto = () => {
    setSelectedPhotoIndex((prev) => 
      prev === mockPhotos.length - 1 ? prev : prev + 1
    );
  };

  const previousPhoto = () => {
    setSelectedPhotoIndex((prev) => 
      prev === 0 ? prev : prev - 1
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cultivation Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="absolute right-2 top-2 z-10 bg-black/50 hover:bg-black/70 p-1"
                >
                  <ZoomIn className="h-4 w-4 text-white" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <div className="relative aspect-video w-full">
                  <Image
                    src={currentPhoto.url}
                    alt={currentPhoto.description}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  {currentPhoto.description}
                </p>
              </DialogContent>
            </Dialog>
            
            <Image
              src={currentPhoto.url}
              alt={currentPhoto.description}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={previousPhoto}
              disabled={selectedPhotoIndex === 0}
              className="bg-black/50 hover:bg-black/70 p-1"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextPhoto}
              disabled={selectedPhotoIndex === mockPhotos.length - 1}
              className="bg-black/50 hover:bg-black/70 p-1"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Day {currentPhoto.day}</span>
            <span className="text-sm text-gray-500">
              Photo {selectedPhotoIndex + 1} of {mockPhotos.length}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{currentPhoto.description}</p>
        </div>

        <div className="mt-4 flex gap-2">
          {mockPhotos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhotoIndex(index)}
              className={`relative h-16 w-16 overflow-hidden rounded-md ${
                index === selectedPhotoIndex ? 'ring-2 ring-primary' : ''
              }`}
            >
              <Image
                src={photo.url}
                alt={`Thumbnail ${photo.day}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
