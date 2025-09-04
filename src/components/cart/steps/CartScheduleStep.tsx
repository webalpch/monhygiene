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
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();

  // Générer les dates disponibles (exclure les dimanches et aujourd'hui)
  const isDateDisabled = (date: Date) => {
    return isSunday(date) || isToday(date) || date < new Date();
  };

  // Formater la date pour l'affichage
  const formatSelectedDate = (date: Date) => {
    if (isTomorrow(date)) return t('services_details.tomorrow');
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
        title: t('services_details.slot_unavailable'),
        description: t('services_details.slot_already_taken'),
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
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header - fixed at top */}
      <div className="px-4 py-4 bg-white border-b border-gray-100 flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-900 text-center mb-1">
          {t('services_details.schedule_intervention')}
        </h2>
        <p className="text-sm text-gray-600 text-center">
          {t('services_details.choose_convenient_slot')}
        </p>
      </div>

      {/* Content area - scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Date Selection */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <span>{t('services_details.choose_date')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-left font-normal h-12 text-base border-2",
                    !selectedDate && "text-muted-foreground",
                    selectedDate && "border-blue-500 bg-blue-50 text-blue-700"
                  )}
                >
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      <span className="capitalize font-medium">
                        {formatSelectedDate(selectedDate)}
                      </span>
                    ) : (
                      <span>{t('services_details.select_date')}</span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-2" align="start" side="bottom">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={isDateDisabled}
                  initialFocus
                  className="p-0 w-full"
                  locale={fr}
                  fromDate={addDays(new Date(), 1)}
                  toDate={addDays(new Date(), 30)}
                  classNames={{
                    months: "flex flex-col space-y-2",
                    month: "space-y-2",
                    caption: "flex justify-center pt-1 relative items-center text-sm font-semibold",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-gray-300 rounded-md hover:bg-gray-100",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-gray-500 rounded-md w-9 h-9 font-normal text-xs flex items-center justify-center",
                    row: "flex w-full mt-1",
                    cell: "h-9 w-9 text-center text-sm p-0 relative",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-sm rounded-md hover:bg-gray-100 focus:bg-gray-100",
                    day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white font-bold",
                    day_today: "bg-accent text-accent-foreground font-semibold",
                    day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
                  }}
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        {/* Time Slots Selection */}
        {selectedDate && (
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Clock className="w-5 h-5 text-primary" />
                <span>{t('services_details.available_slots')}</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Pour le {formatSelectedDate(selectedDate).toLowerCase()}
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {slotsLoading && (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">{t('services_details.checking_slots')}</p>
                </div>
              )}
              
              <div className="space-y-3">
                {/* Morning Slot */}
                <Button
                  variant={isSlotSelected('morning') ? 'default' : 'outline'}
                  onClick={() => handleTimeSlotSelect('morning')}
                  disabled={isSlotUnavailable('morning')}
                  className={cn(
                    "w-full h-16 p-3 border-2 transition-all duration-200 justify-start",
                    isSlotSelected('morning') 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : isSlotUnavailable('morning')
                        ? "border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-60"
                        : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                  )}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="flex-shrink-0">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        isSlotSelected('morning') 
                          ? "bg-white/20" 
                          : isSlotUnavailable('morning')
                            ? "bg-red-100"
                            : "bg-blue-100"
                      )}>
                        {isSlotUnavailable('morning') ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <Clock className={cn(
                            "w-5 h-5",
                            isSlotSelected('morning') ? "text-white" : "text-blue-600"
                          )} />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className={cn(
                        "font-semibold text-base",
                        isSlotSelected('morning') 
                          ? "text-white" 
                          : "text-black hover:text-black"
                      )}>
                        {t('services_details.morning')}
                      </div>
                      <div className={cn(
                        "text-sm",
                        isSlotSelected('morning') 
                          ? "text-white/80" 
                          : isSlotUnavailable('morning')
                            ? "text-red-400"
                            : "text-gray-600"
                      )}>
                        {t('services_details.morning_hours')}
                      </div>
                    </div>
                    {isSlotSelected('morning') && (
                      <CheckCircle className="w-5 h-5 text-white" />
                    )}
                  </div>
                </Button>

                {/* Afternoon Slot */}
                <Button
                  variant={isSlotSelected('afternoon') ? 'default' : 'outline'}
                  onClick={() => handleTimeSlotSelect('afternoon')}
                  disabled={isSlotUnavailable('afternoon')}
                  className={cn(
                    "w-full h-16 p-3 border-2 transition-all duration-200 justify-start",
                    isSlotSelected('afternoon') 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : isSlotUnavailable('afternoon')
                        ? "border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-60"
                        : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                  )}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="flex-shrink-0">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        isSlotSelected('afternoon') 
                          ? "bg-white/20" 
                          : isSlotUnavailable('afternoon')
                            ? "bg-red-100"
                            : "bg-blue-100"
                      )}>
                        {isSlotUnavailable('afternoon') ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <Clock className={cn(
                            "w-5 h-5",
                            isSlotSelected('afternoon') ? "text-white" : "text-blue-600"
                          )} />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className={cn(
                        "font-semibold text-base",
                        isSlotSelected('afternoon') 
                          ? "text-white" 
                          : "text-black hover:text-black"
                      )}>
                        {t('services_details.afternoon')}
                      </div>
                      <div className={cn(
                        "text-sm",
                        isSlotSelected('afternoon') 
                          ? "text-white/80" 
                          : isSlotUnavailable('afternoon')
                            ? "text-red-400"
                            : "text-gray-600"
                      )}>
                        {t('services_details.afternoon_hours')}
                      </div>
                    </div>
                    {isSlotSelected('afternoon') && (
                      <CheckCircle className="w-5 h-5 text-white" />
                    )}
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-3 bg-gray-50">
            <CardTitle className="flex items-center justify-between text-base">
              <span>{t('services_details.summary')}</span>
              <Badge variant="secondary" className="text-sm px-2 py-1 bg-primary text-white">
                {totalPrice} CHF
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-3">
            {/* Services List */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900">{t('services_details.selected_services')}</h4>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg p-2">
                  <span className="font-medium text-gray-800 text-xs">{item.service.name}</span>
                  <span className="font-bold text-primary text-xs">{item.estimatedPrice} CHF</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center text-base font-bold">
                <span>Total</span>
                <span className="text-primary">{totalPrice} CHF</span>
              </div>
            </div>

            {selectedSlot && (
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="text-sm text-green-800">
                  <div className="font-semibold">{t('services_details.intervention_date')} :</div>
                  <div className="text-xs">{formatSelectedDate(selectedSlot.date)}</div>
                  <div className="font-semibold mt-1">{t('services_details.schedule')} :</div>
                  <div className="text-xs">{selectedSlot.period === 'morning' ? t('services_details.morning_hours') : t('services_details.afternoon_hours')}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation - fixed at bottom */}
      <div className="px-4 py-4 bg-white border-t border-gray-100 flex-shrink-0">
        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 h-12 text-sm border-2"
          >
            ← {t('back')}
          </Button>
          
          {selectedSlot && (
            <Button 
              onClick={onNext} 
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
            >
              {t('continue')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};