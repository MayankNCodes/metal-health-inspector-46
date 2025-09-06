import React from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationServiceProps {
  onLocationUpdate: (latitude: number, longitude: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const LocationService: React.FC<LocationServiceProps> = ({
  onLocationUpdate,
  isLoading,
  setIsLoading
}) => {
  const { toast } = useToast();

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      // Check if we have permission
      const permissions = await Geolocation.checkPermissions();
      
      if (permissions.location !== 'granted') {
        const requestPermissions = await Geolocation.requestPermissions();
        if (requestPermissions.location !== 'granted') {
          throw new Error('Location permission denied');
        }
      }

      // Get current position
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 3600000 // 1 hour
      });

      const { latitude, longitude } = coordinates.coords;
      onLocationUpdate(latitude, longitude);
      
      toast({
        title: "Location Retrieved",
        description: `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      });
    } catch (error) {
      // Fallback to browser geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            onLocationUpdate(latitude, longitude);
            toast({
              title: "Location Retrieved",
              description: `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            });
          },
          (error) => {
            toast({
              title: "Location Error",
              description: "Unable to retrieve your current location. Please enter coordinates manually.",
              variant: "destructive"
            });
          }
        );
      } else {
        toast({
          title: "Geolocation Not Supported",
          description: "Your device doesn't support geolocation. Please enter coordinates manually.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={getCurrentLocation}
      disabled={isLoading}
      variant="outline"
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Getting Location...
        </>
      ) : (
        <>
          <MapPin className="h-4 w-4 mr-2" />
          Fetch GPS Location
        </>
      )}
    </Button>
  );
};