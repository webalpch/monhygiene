
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { TimeSlot } from '@/types/reservation';
import { format, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarDays, Clock, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ScheduleStepProps {
  selectedSlot: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ScheduleStep = ({ selectedSlot, onSlotSelect, onNext, onBack }: ScheduleStepProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selectedSlot?.date || undefined
  );
  const [bookedSlots, setBookedSlots] = useState<{date: string, periods: string[]}[]>([]);
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const maxDate = addDays(today, 365);

  const timeSlots = [
    { 
      period: 'morning' as const, 
      label: '08h00 - 12h00', 
      description: 'Matinée',
      icon: '🌅',
      popular: false
    },
    { 
      period: 'afternoon' as const, 
      label: '13h00 - 18h00', 
      description: 'Après-midi',
      icon: '☀️',
      popular: true
    }
  ];

  // Fonction pour récupérer les créneaux réservés
  const fetchBookedSlots = async (date: Date) => {
    try {
      setLoading(true);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('reservations')
        .select('scheduled_time, status')
        .eq('scheduled_date', dateStr)
        .in('status', ['confirmed', 'in_progress']); // Exclure les annulées
      
      if (error) throw error;
      
      const periods: string[] = [];
      data?.forEach(reservation => {
        const time = reservation.scheduled_time;
        if (time >= '08:00' && time <= '12:00') {
          periods.push('morning');
        } else if (time >= '13:00' && time <= '18:00') {
          periods.push('afternoon');
        }
      });
      
      setBookedSlots(prev => {
        const updated = prev.filter(slot => slot.date !== dateStr);
        return [...updated, { date: dateStr, periods: [...new Set(periods)] }];
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des créneaux:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vérifier les créneaux disponibles quand la date change
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate]);

  // Fonction pour vérifier si un créneau est disponible
  const isSlotAvailable = (period: 'morning' | 'afternoon') => {
    if (!selectedDate) return true;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const daySlots = bookedSlots.find(slot => slot.date === dateStr);
    return !daySlots?.periods.includes(period);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    // Reset time slot when date changes
    if (selectedSlot && date && !isSameDay(selectedSlot.date, date)) {
      // Clear time slot selection if date changes
    }
  };

  const handleTimeSlotSelect = (period: 'morning' | 'afternoon', label: string) => {
    if (!selectedDate) return;

    const slot: TimeSlot = {
      date: selectedDate,
      period,
      label
    };

    onSlotSelect(slot);
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-0">
      {/* Header moderne réduit pour mobile */}
      <div className="text-center mb-4 sm:mb-8 lg:mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-3 sm:mb-6">
          <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
          Quand souhaitez-vous notre intervention ?
        </h1>
        <p className="text-sm sm:text-base lg:text-xl text-gray-600 px-2">
          Choisissez la date et l'horaire qui vous conviennent le mieux
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-8 mb-4 sm:mb-6">
        {/* Calendar moderne adapté mobile */}
        <div className="bg-white rounded-2xl p-3 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center mb-3 sm:mb-6">
            <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-2 sm:mr-3" />
            <h3 className="text-base sm:text-lg lg:text-2xl font-semibold text-gray-900">Sélectionnez une date</h3>
          </div>
          
          <div className="calendar-container w-full flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => 
                date < tomorrow || 
                date > maxDate || 
                isWeekend(date)
              }
              locale={fr}
              className="w-full max-w-full [&_.rdp-table]:w-full [&_.rdp-table]:max-w-none [&_.rdp-day_button]:h-9 [&_.rdp-day_button]:w-9 sm:[&_.rdp-day_button]:h-12 sm:[&_.rdp-day_button]:w-12 [&_.rdp-day_button]:text-sm sm:[&_.rdp-day_button]:text-base [&_.rdp-head_cell]:h-9 [&_.rdp-head_cell]:w-9 sm:[&_.rdp-head_cell]:h-12 sm:[&_.rdp-head_cell]:w-12 [&_.rdp-head_cell]:text-center [&_.rdp-head_cell]:text-xs sm:[&_.rdp-head_cell]:text-sm [&_.rdp-cell]:p-0 [&_.rdp-day_selected]:bg-primary [&_.rdp-day_selected]:text-white [&_.rdp-day_selected]:font-semibold [&_.rdp-day_selected]:rounded-full [&_.rdp-nav_button]:h-8 [&_.rdp-nav_button]:w-8 sm:[&_.rdp-nav_button]:h-9 sm:[&_.rdp-nav_button]:w-9 [&_.rdp-caption_label]:text-base sm:[&_.rdp-caption_label]:text-lg [&_.rdp-caption_label]:font-semibold pointer-events-auto"
            />
          </div>
          
          <div className="mt-3 sm:mt-6 space-y-1 sm:space-y-3 text-xs sm:text-sm">
            <div className="flex items-center text-gray-600">
              <div className="w-2 h-2 bg-primary rounded-full mr-2 sm:mr-3"></div>
              <span>Interventions du lundi au vendredi uniquement</span>
            </div>
            <div className="flex items-center text-gray-600">
              <div className="w-2 h-2 bg-gray-300 rounded-full mr-2 sm:mr-3"></div>
              <span>Réservation possible à partir de demain</span>
            </div>
            <div className="flex items-center text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
              <span>Disponibilités en temps réel</span>
            </div>
          </div>
        </div>

        {/* Time Slots modernes adaptés mobile */}
        <div className="bg-white rounded-2xl p-3 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center mb-3 sm:mb-6">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-2 sm:mr-3" />
            <h3 className="text-base sm:text-lg lg:text-2xl font-semibold text-gray-900">Choisissez un créneau</h3>
          </div>
          
          {selectedDate ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="font-semibold text-blue-900 text-sm sm:text-base">
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </div>
                <div className="text-blue-700 text-xs sm:text-sm mt-1">
                  Sélectionnez votre créneau préféré
                </div>
              </div>
              
              {timeSlots.map((slot) => {
                const isSelected = selectedSlot?.period === slot.period && 
                                 selectedDate && 
                                 selectedSlot?.date && 
                                 isSameDay(selectedSlot.date, selectedDate);
                const isAvailable = isSlotAvailable(slot.period);

                return (
                  <button
                    key={slot.period}
                    onClick={() => isAvailable ? handleTimeSlotSelect(slot.period, slot.label) : null}
                    disabled={!isAvailable}
                    className={`w-full p-3 sm:p-4 lg:p-6 rounded-xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                      !isAvailable
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : isSelected
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-gray-200 hover:border-primary/50 hover:shadow-md'
                    }`}
                  >
                    {!isAvailable && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                        Complet
                      </div>
                    )}
                    {slot.popular && isAvailable && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full">
                        Populaire
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="text-2xl sm:text-3xl">{slot.icon}</div>
                        <div>
                          <div className="font-semibold text-base sm:text-lg text-gray-900">{slot.description}</div>
                          <div className="text-sm sm:text-base text-gray-600">{slot.label}</div>
                          <div className="text-xs sm:text-sm text-gray-500 mt-1">
                            {slot.period === 'morning' ? 'Idéal pour commencer la journée' : 'Parfait après le déjeuner'}
                          </div>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="text-primary">
                          <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <CalendarDays className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <div className="text-gray-500 text-base sm:text-lg">Sélectionnez d'abord une date</div>
              <div className="text-gray-400 text-sm mt-2">Choisissez une date dans le calendrier pour voir les créneaux disponibles</div>
            </div>
          )}
        </div>
      </div>

      {selectedSlot && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-green-900 text-base sm:text-lg">Créneau confirmé</div>
              <div className="text-green-700 mt-1 text-sm sm:text-base">
                {format(selectedSlot.date, 'EEEE d MMMM yyyy', { locale: fr })} - {selectedSlot.label}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation adaptée mobile - placée plus haut */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 pt-2 sm:pt-4 mb-6 sm:mb-8">
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto px-4 py-3 sm:px-8 sm:py-4 text-sm sm:text-base lg:text-lg rounded-2xl border-2 hover:bg-gray-50 transition-all duration-300 order-2 sm:order-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Retour
        </Button>
        
        {selectedSlot && (
          <Button
            onClick={onNext}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-4 py-3 sm:px-8 sm:py-4 text-sm sm:text-base lg:text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 order-1 sm:order-2"
          >
            Continuer
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
