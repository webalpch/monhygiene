
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ReservationDraft, WizardStep } from '@/types/reservation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'reservationDraft';

const initialDraft: ReservationDraft = {
  address: null,
  serviceId: '',
  subThemes: {},
  slot: null,
  contact: {
    name: '',
    email: '',
    phone: '',
  },
};

export const useReservation = () => {
  const [draft, setDraft] = useState<ReservationDraft>(initialDraft);
  const [currentStep, setCurrentStep] = useState<WizardStep>('address');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDraft(parsed);
      } catch (error) {
        console.error('Failed to load reservation draft:', error);
      }
    }
  }, []);

  // Save to localStorage whenever draft changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  const updateDraft = (updates: Partial<ReservationDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  };

  const saveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  };

  const clearDraft = () => {
    setDraft(initialDraft);
    localStorage.removeItem(STORAGE_KEY);
  };

  const canProceedToStep = (step: WizardStep): boolean => {
    switch (step) {
      case 'address':
        return true;
      case 'service':
        return !!draft.address;
      case 'subthemes':
        return !!draft.address && !!draft.serviceId;
      case 'schedule':
        return !!draft.address && !!draft.serviceId;
      case 'contact':
        return !!draft.address && !!draft.serviceId && !!draft.slot;
      default:
        return false;
    }
  };

  const submitReservation = async (): Promise<{ success: boolean; error?: string }> => {
    if (isSubmitting) return { success: false, error: "Soumission en cours..." };

    setIsSubmitting(true);
    try {
      console.log('🔍 Debug - Draft data:', {
        contact: draft.contact,
        address: draft.address,
        serviceId: draft.serviceId,
        slot: draft.slot,
        subThemes: draft.subThemes
      });

      // Vérification des données requises
      if (!draft.contact.name?.trim() || !draft.contact.email?.trim() || !draft.contact.phone?.trim()) {
        console.log('❌ Contact validation failed:', draft.contact);
        toast({
          title: "Informations manquantes",
          description: "Veuillez remplir tous les champs de contact",
          variant: "destructive"
        });
        return { success: false, error: "Informations de contact manquantes" };
      }

      if (!draft.address || !draft.serviceId || !draft.slot) {
        toast({
          title: "Données manquantes",
          description: "Veuillez compléter toutes les étapes de la réservation",
          variant: "destructive"
        });
        return { success: false, error: "Données de réservation manquantes" };
      }

      // Calcul du prix estimé basé sur les sous-thèmes
      let estimatedPrice = 0;
      let totalDuration = 60; // Durée par défaut

      // Analyser les sous-thèmes pour calculer le prix
      const subThemes = draft.subThemes;
      if (subThemes && Object.keys(subThemes).length > 0) {
        Object.values(subThemes).forEach((subTheme: any) => {
          if (subTheme.estimatedPrice) {
            estimatedPrice += subTheme.estimatedPrice;
          }
          if (subTheme.duration) {
            totalDuration += subTheme.duration;
          }
        });
      }

      // Si aucun prix n'est calculé via les sous-thèmes, utiliser des prix par défaut selon le service
      if (estimatedPrice === 0) {
        // Prix par défaut selon le type de service
        switch (draft.serviceId) {
          case 'nettoyage-vehicule':
            estimatedPrice = 150;
            break;
          case 'nettoyage-canape':
            estimatedPrice = 120;
            break;
          case 'nettoyage-matelas':
            estimatedPrice = 100;
            break;
          case 'shampooinage-sieges':
            estimatedPrice = 80;
            break;
          case 'nettoyage-billard':
            estimatedPrice = 130;
            break;
          case 'nettoyage-domicile':
            estimatedPrice = 200;
            break;
          case 'nettoyage-bureaux':
            estimatedPrice = 180;
            break;
          default:
            estimatedPrice = 100;
        }
      }

      // Préparer les données pour Supabase
      const reservationData = {
        client_name: draft.contact.name,
        client_email: draft.contact.email,
        client_phone: draft.contact.phone,
        address: draft.address.address || draft.address.place_name,
        city: draft.address.city || '',
        postcode: draft.address.postcode || '',
        coordinates: draft.address.center,
        service_type: draft.serviceId,
        service_details: {
          serviceId: draft.serviceId,
          subThemes: draft.subThemes,
          address: draft.address,
          slot: draft.slot
        },
        scheduled_date: format(draft.slot.date, 'yyyy-MM-dd'), // Format YYYY-MM-DD en local
        scheduled_time: draft.slot.period === 'morning' ? '09:00' : '14:00', // Conversion period vers heure
        duration_minutes: totalDuration,
        status: 'confirmed' as const,
        estimated_price: estimatedPrice,
        payment_status: 'pending' as const,
        notes: '',
        internal_notes: `Réservation créée via le site web le ${new Date().toLocaleString('fr-CH')}`
      };

      console.log('💾 Saving reservation to Supabase:', reservationData);

      // Sauvegarder dans Supabase
      const { data, error } = await supabase
        .from('reservations')
        .insert([reservationData])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        toast({
          title: "Erreur de sauvegarde",
          description: "La réservation n'a pas pu être sauvegardée. Veuillez réessayer.",
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }

      console.log('✅ Reservation saved successfully:', data);
      
      toast({
        title: "Réservation confirmée",
        description: "Votre réservation a été enregistrée avec succès",
      });

      return { success: true };

    } catch (error) {
      console.error('💥 Error saving reservation:', error);
      toast({
        title: "Erreur inattendue",
        description: "Une erreur s'est produite lors de la sauvegarde",
        variant: "destructive"
      });
      return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    draft,
    currentStep,
    setCurrentStep,
    updateDraft,
    saveDraft,
    clearDraft,
    canProceedToStep,
    submitReservation,
    isSubmitting,
  };
};
