import { useState, useEffect } from "react";
import { Calendar, Clock, Plus, Trash2, Save, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

interface ScheduleSlot {
  id?: string;
  date: string;
  period: 'morning' | 'afternoon';
  is_available: boolean;
  created_at?: string;
}

export default function AdminSchedule() {
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [unsavedChanges, setUnsavedChanges] = useState<ScheduleSlot[]>([]);

  // Fetch schedule slots from database
  const fetchSchedule = async () => {
    setLoading(true);
    try {
      console.log('🔧 Fetching admin schedule...');
      const { data, error } = await supabase
        .from('admin_schedule')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('❌ Erreur Supabase admin_schedule:', error);
        console.error('❌ Détail erreur:', error.message, error.code);
        
        // Check if it's a missing table error
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          toast({
            title: "Table manquante",
            description: "La table admin_schedule n'existe pas. Veuillez créer la table dans Supabase.",
            variant: "destructive"
          });
          return;
        }
        
        throw error;
      }
      
      console.log('✅ Schedule loaded:', data?.length || 0, 'slots');
      setScheduleSlots(data || []);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du planning:', error);
      toast({
        title: "Erreur de base de données",
        description: "Vérifiez que la table admin_schedule existe dans Supabase",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Save schedule changes
  const saveSchedule = async () => {
    if (unsavedChanges.length === 0) return;

    setLoading(true);
    try {
      console.log('💾 Saving schedule changes:', unsavedChanges);
      
      // Upsert all changes (both available and unavailable)
      const { data, error } = await supabase
        .from('admin_schedule')
        .upsert(
          unsavedChanges.map(slot => ({
            date: slot.date,
            period: slot.period,
            is_available: slot.is_available
          })),
          { 
            onConflict: 'date,period',
            ignoreDuplicates: false 
          }
        )
        .select();

      if (error) {
        console.error('❌ Erreur sauvegarde:', error);
        throw error;
      }
      
      console.log('✅ Saved successfully:', data);

      setUnsavedChanges([]);
      await fetchSchedule();
      
      toast({
        title: "Succès",
        description: "Planning sauvegardé avec succès"
      });
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde", 
        description: error.message || "Vérifiez que la table admin_schedule existe dans Supabase",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle slot availability
  const toggleSlotAvailability = (date: string, period: 'morning' | 'afternoon') => {
    const existingSlot = scheduleSlots.find(s => s.date === date && s.period === period);
    const existingUnsaved = unsavedChanges.find(s => s.date === date && s.period === period);
    
    const currentAvailability = existingUnsaved?.is_available ?? existingSlot?.is_available ?? true;
    const newAvailability = !currentAvailability;

    // Update unsaved changes
    const newUnsavedChanges = unsavedChanges.filter(s => !(s.date === date && s.period === period));
    newUnsavedChanges.push({
      date,
      period,
      is_available: newAvailability
    });
    
    setUnsavedChanges(newUnsavedChanges);
  };

  // Get availability for a specific slot
  const getSlotAvailability = (date: string, period: 'morning' | 'afternoon') => {
    const unsavedSlot = unsavedChanges.find(s => s.date === date && s.period === period);
    if (unsavedSlot) return unsavedSlot.is_available;

    const existingSlot = scheduleSlots.find(s => s.date === date && s.period === period);
    return existingSlot?.is_available ?? true; // Default to available
  };

  // Generate week days
  const getWeekDays = () => {
    const startOfCurrentWeek = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      days.push(addDays(startOfCurrentWeek, i));
    }
    
    return days;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = addDays(selectedWeek, direction === 'next' ? 7 : -7);
    setSelectedWeek(newWeek);
  };

  const resetToCurrentWeek = () => {
    setSelectedWeek(new Date());
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const weekDays = getWeekDays();

  return (
    <div className="p-4 lg:p-6 space-y-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Gestion des Horaires
          </h1>
          <p className="text-gray-600">
            Gérez vos disponibilités pour les réservations
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {unsavedChanges.length > 0 && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
              <AlertCircle className="w-3 h-3 mr-1" />
              {unsavedChanges.length} modification{unsavedChanges.length > 1 ? 's' : ''}
            </Badge>
          )}
          
          <Button
            onClick={saveSchedule}
            disabled={loading || unsavedChanges.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Planning de la semaine
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                ←
              </Button>
              
              <span className="text-sm font-medium px-4">
                {format(weekDays[0], 'd MMM', { locale: fr })} - {format(weekDays[6], 'd MMM yyyy', { locale: fr })}
              </span>
              
              <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                →
              </Button>
              
              <Button variant="outline" size="sm" onClick={resetToCurrentWeek}>
                Aujourd'hui
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day, index) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isToday = isSameDay(day, new Date());
              const isSunday = day.getDay() === 0;
              
              return (
                <div
                  key={dateStr}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    isToday 
                      ? 'border-blue-300 bg-blue-50' 
                      : isSunday 
                        ? 'border-gray-200 bg-gray-100'
                        : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className="text-xs text-gray-500 mb-1">
                      {format(day, 'EEE', { locale: fr })}
                    </div>
                    <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                      {format(day, 'd')}
                    </div>
                  </div>

                  {isSunday ? (
                    <div className="text-center text-gray-400 text-sm py-8">
                      Fermé le dimanche
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Morning Slot */}
                      <div
                        onClick={() => toggleSlotAvailability(dateStr, 'morning')}
                        className={`p-3 rounded-lg cursor-pointer transition-all border ${
                          getSlotAvailability(dateStr, 'morning')
                            ? 'bg-green-50 border-green-200 hover:bg-green-100'
                            : 'bg-red-50 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">Matin</div>
                            <div className="text-xs text-gray-500">09h00 - 12h00</div>
                          </div>
                          <div>
                            {getSlotAvailability(dateStr, 'morning') ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Afternoon Slot */}
                      <div
                        onClick={() => toggleSlotAvailability(dateStr, 'afternoon')}
                        className={`p-3 rounded-lg cursor-pointer transition-all border ${
                          getSlotAvailability(dateStr, 'afternoon')
                            ? 'bg-green-50 border-green-200 hover:bg-green-100'
                            : 'bg-red-50 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">Après-midi</div>
                            <div className="text-xs text-gray-500">14h00 - 17h00</div>
                          </div>
                          <div>
                            {getSlotAvailability(dateStr, 'afternoon') ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Instructions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cliquez sur un créneau pour le rendre disponible (vert) ou indisponible (rouge)</li>
                <li>• Par défaut, tous les créneaux sont disponibles</li>
                <li>• Les créneaux indisponibles n'apparaîtront pas dans le système de réservation</li>
                <li>• N'oubliez pas de sauvegarder vos modifications</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}