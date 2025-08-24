import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Phone, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useReservations } from "@/hooks/useReservations";

const DashboardEn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { reservations, isLoading, error } = useReservations();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/en/login');
      } else {
        setUser(user);
      }
    };

    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout successful",
        description: "See you soon!",
      });
      navigate('/en');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error logging out",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.email}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservations?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <Badge className="bg-green-100 text-green-800">
                {reservations?.filter(r => r.status === 'confirmed').length || 0}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">Confirmed reservations</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Badge className="bg-yellow-100 text-yellow-800">
                {reservations?.filter(r => r.status === 'pending').length || 0}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">Awaiting confirmation</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reservations</CardTitle>
            <CardDescription>
              List of all received reservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-red-600 mb-4">
                Error loading reservations: {error}
              </div>
            )}
            
            {reservations && reservations.length > 0 ? (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{reservation.client_name}</span>
                          <Badge className={getStatusColor(reservation.status)}>
                            {getStatusText(reservation.status)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {reservation.client_phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(reservation.scheduled_date).toLocaleDateString('en-US')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {reservation.scheduled_time}
                          </div>
                        </div>

                        <div className="flex items-start gap-1 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{reservation.address}, {reservation.city} {reservation.postcode}</span>
                        </div>

                        <Separator className="my-2" />
                        
                        <div>
                          <span className="text-sm font-medium text-gray-700">Service: </span>
                          <span className="text-sm text-gray-600">{reservation.service_type}</span>
                        </div>

                        {reservation.notes && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Notes: </span>
                            <span className="text-sm text-gray-600">{reservation.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No reservations found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardEn;