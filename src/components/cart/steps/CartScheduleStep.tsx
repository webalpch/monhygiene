import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, CheckCircle, ChevronDown, AlertCircle } from 'lucide-react';
import { CartItem } from '@/hooks/useCart';
import { useAvailableSlots } from '@/hooks/useAvailableSlots';
import { format, addDays, isSunday, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CartScheduleStepProps {
  cartItems: CartItem[];
  totalPrice: number;
  selectedSlot: { date: Date; period: 'morning' | 'afternoon' } | null;
  onSlotSelect: (slot: { date: Date; period: 'morning' | 'afternoon' }) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CartScheduleStep: React.FC<CartScheduleStepProps> = ({
  cartItems,
  totalPrice,
  selectedSlot,
  onSlotSelect,
  onNext,
  onBack
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selectedSlot?.date);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { isSlotAvailable, loading: slotsLoading, refreshSlots } = useAvailableSlots();
  const { toast } = useToast();

  // Générer les dates disponibles (exclure les dimanches et aujourd'hui)
  const isDateDisabled = (date: Date) => {
    return isSunday(date) || isToday(date) || date < new Date();
  };

  // Formater la date pour l'affichage
  const formatSelectedDate = (date: Date) => {
    if (isTomorrow(date)) return "Demain";
    return format(date, "EEEE d MMMM", { locale: fr });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isDateDisabled(date)) {
      setSelectedDate(date);
      setIsCalendarOpen(false);
      // Actualiser les créneaux disponibles quand une nouvelle date est sélectionnée
      refreshSlots();
    }
  };

  const handleTimeSlotSelect = (period: 'morning' | 'afternoon') => {
    if (!selectedDate) return;
    
    if (!isSlotAvailable(selectedDate, period)) {
      toast({
        title: "Créneau indisponible",
        description: "Ce créneau est déjà réservé. Veuillez en choisir un autre.",
        variant: "destructive"
      });
      return;
    }
    
    onSlotSelect({ date: selectedDate, period });
  };

  const isSlotSelected = (period: 'morning' | 'afternoon') => {
    if (!selectedSlot || !selectedDate) return false;
    return selectedSlot.date.toDateString() === selectedDate.toDateString() && 
           selectedSlot.period === period;
  };

  const isSlotUnavailable = (period: 'morning' | 'afternoon') => {
    if (!selectedDate) return false;
    return !isSlotAvailable(selectedDate, period);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Planifiez votre intervention</h2>
        <p className="text-lg text-gray-600">Choisissez une date et un créneau horaire qui vous convient</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Schedule Selection */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
          {/* Date Selection */}
          <Card className="border-2 border-primary/20 w-full max-w-full overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <CalendarIcon className="w-6 h-6 text-primary" />
                <span>Choisir une date</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-14 text-lg border-2",
                      !selectedDate && "text-muted-foreground",
                      selectedDate && "border-primary/50 bg-primary/5"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5" />
                    {selectedDate ? (
                      <span className="capitalize font-medium">
                        {formatSelectedDate(selectedDate)}
                      </span>
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                    <ChevronDown className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 max-w-xs sm:max-w-lg" align="start" side="bottom">
                  <div className="p-4 sm:p-6">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={isDateDisabled}
                      initialFocus
                      className={cn("p-4 pointer-events-auto w-full text-base sm:text-lg")}
                      locale={fr}
                      fromDate={addDays(new Date(), 1)}
                      toDate={addDays(new Date(), 30)}
                      classNames={{
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center text-lg font-semibold",
                        caption_label: "text-lg font-bold",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100 border border-gray-300 rounded-md hover:bg-gray-100",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-gray-500 rounded-md w-10 h-10 font-normal text-base flex items-center justify-center",
                        row: "flex w-full mt-2",
                        cell: "h-10 w-10 text-center text-base p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 text-base rounded-md hover:bg-gray-100 focus:bg-gray-100",
                        day_range_end: "day-range-end",
                        day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white font-bold",
                        day_today: "bg-accent text-accent-foreground font-semibold",
                        day_outside: "day-outside text-gray-400 opacity-50 aria-selected:bg-accent/50 aria-selected:text-gray-400 aria-selected:opacity-30",
                        day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
                        day_hidden: "invisible",
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          {/* Time Slots Selection */}
          {selectedDate && (
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <Clock className="w-6 h-6 text-primary" />
                  <span>Créneaux disponibles</span>
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Pour le {formatSelectedDate(selectedDate).toLowerCase()}
                </p>
              </CardHeader>
              <CardContent>
                {slotsLoading && (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Vérification des créneaux...</p>
                  </div>
                )}
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Morning Slot */}
                  <Button
                    variant={isSlotSelected('morning') ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => handleTimeSlotSelect('morning')}
                    disabled={isSlotUnavailable('morning')}
                    className={cn(
                      "h-20 p-4 border-2 transition-all duration-200 relative",
                      isSlotSelected('morning') 
                        ? "bg-primary text-white border-primary shadow-lg scale-105" 
                        : isSlotUnavailable('morning')
                          ? "border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-60"
                          : "border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="flex-shrink-0">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          isSlotSelected('morning') 
                            ? "bg-white/20" 
                            : isSlotUnavailable('morning')
                              ? "bg-red-100"
                              : "bg-primary/10"
                        )}>
                          {isSlotUnavailable('morning') ? (
                            <AlertCircle className="w-6 h-6 text-red-500" />
                          ) : (
                            <Clock className={cn(
                              "w-6 h-6",
                              isSlotSelected('morning') ? "text-white" : "text-primary"
                            )} />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-lg">
                          Matin {isSlotUnavailable('morning') && "(Occupé)"}
                        </div>
                        <div className={cn(
                          "text-sm",
                          isSlotSelected('morning') 
                            ? "text-white/80" 
                            : isSlotUnavailable('morning')
                              ? "text-red-400"
                              : "text-gray-600"
                        )}>
                          09h00 - 12h00
                        </div>
                      </div>
                      {isSlotSelected('morning') && (
                        <CheckCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </Button>

                  {/* Afternoon Slot */}
                  <Button
                    variant={isSlotSelected('afternoon') ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => handleTimeSlotSelect('afternoon')}
                    disabled={isSlotUnavailable('afternoon')}
                    className={cn(
                      "h-20 p-4 border-2 transition-all duration-200 relative",
                      isSlotSelected('afternoon') 
                        ? "bg-primary text-white border-primary shadow-lg scale-105" 
                        : isSlotUnavailable('afternoon')
                          ? "border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-60"
                          : "border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="flex-shrink-0">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          isSlotSelected('afternoon') 
                            ? "bg-white/20" 
                            : isSlotUnavailable('afternoon')
                              ? "bg-red-100"
                              : "bg-primary/10"
                        )}>
                          {isSlotUnavailable('afternoon') ? (
                            <AlertCircle className="w-6 h-6 text-red-500" />
                          ) : (
                            <Clock className={cn(
                              "w-6 h-6",
                              isSlotSelected('afternoon') ? "text-white" : "text-primary"
                            )} />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-lg">
                          Après-midi {isSlotUnavailable('afternoon') && "(Occupé)"}
                        </div>
                        <div className={cn(
                          "text-sm",
                          isSlotSelected('afternoon') 
                            ? "text-white/80" 
                            : isSlotUnavailable('afternoon')
                              ? "text-red-400"
                              : "text-gray-600"
                        )}>
                          14h00 - 17h00
                        </div>
                      </div>
                      {isSlotSelected('afternoon') && (
                        <CheckCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </Button>
                </div>


                {/* Information sur la mise à jour en temps réel */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${slotsLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <p className="text-xs text-blue-800">
                      {slotsLoading ? 'Vérification des disponibilités...' : 'Créneaux mis à jour en temps réel'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center justify-between text-xl">
                <span>Récapitulatif</span>
                <Badge variant="secondary" className="text-lg px-3 py-1 bg-primary text-white">
                  {totalPrice} CHF
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Services List */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Services sélectionnés</h4>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-sm bg-gray-50 rounded-lg p-3">
                    <span className="font-medium text-gray-800">{item.service.name}</span>
                    <span className="font-bold text-primary ml-2">{item.estimatedPrice} CHF</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">{totalPrice} CHF</span>
                </div>
              </div>

              {selectedSlot && (
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-green-800">
                      <div className="font-semibold">Date d'intervention :</div>
                      <div>{formatSelectedDate(selectedSlot.date)}</div>
                      <div className="font-semibold mt-1">Horaire :</div>
                      <div>{selectedSlot.period === 'morning' ? '09h00 - 12h00' : '14h00 - 17h00'}</div>
                    </div>
                  </div>
                  
                  <Button onClick={onNext} className="w-full h-12 text-lg font-semibold" size="lg">
                    Finaliser la commande
                  </Button>
                </div>
              )}

              {!selectedSlot && (
                <div className="text-center text-gray-500 text-sm py-4">
                  Sélectionnez une date et un créneau pour continuer
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t-2 border-gray-200">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-8 py-3 text-lg border-2"
        >
          ← Retour aux services
        </Button>
      </div>
    </div>
  );
};