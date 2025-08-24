import React, { createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';

type Language = 'fr' | 'de' | 'en';

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navigation
    'nav.services': 'Services',
    'nav.about': 'À propos',
    'nav.gallery': 'Galerie',
    'nav.reviews': 'Avis',
    'nav.contact': 'Contact',
    'nav.reservation': 'Réservation',
    
    // Hero Section
    'hero.title': 'Votre Partenaire de Confiance pour le Nettoyage Professionnel',
    'hero.subtitle': 'Des services de nettoyage exceptionnels pour particuliers et entreprises en Valais',
    'hero.cta': 'Réserver maintenant',
    'hero.contact': 'Nous contacter',
    'hero.description': 'Découvrez nos services de nettoyage professionnels et personnalisés',
    
    // Services
    'services.title': 'Nos Services',
    'services.subtitle': 'Des solutions de nettoyage professionnelles adaptées à tous vos besoins',
    'services.cta': 'Voir tous nos services',
    'services.book': 'Réserver',
    'services.from': 'À partir de',
    'services.chf': 'CHF',
    'services.contact_price': 'Prix sur demande',
    
    // Service Details
    'service.canape.title': 'Nettoyage de Canapés',
    'service.canape.description': 'Redonnez vie à vos canapés avec notre service de nettoyage professionnel à domicile.',
    'service.canape.details': 'Notre service de nettoyage de canapés utilise des techniques avancées pour éliminer les taches, odeurs et allergènes.',
    
    'service.matelas.title': 'Nettoyage de Matelas',
    'service.matelas.description': 'Un sommeil sain commence par un matelas propre. Profitez de notre expertise.',
    'service.matelas.details': 'Nous éliminons les acariens, bactéries et mauvaises odeurs pour un environnement de sommeil optimal.',
    
    'service.vehicule.title': 'Nettoyage de Véhicules',
    'service.vehicule.description': 'Intérieur et extérieur, redonnez éclat à votre voiture avec notre service mobile.',
    'service.vehicule.details': 'Service complet de nettoyage auto à domicile : intérieur, extérieur, et détaillage.',
    
    'service.tapis.title': 'Nettoyage de Tapis & Moquettes',
    'service.tapis.description': 'Retrouvez la beauté originale de vos tapis et moquettes.',
    'service.tapis.details': 'Techniques professionnelles pour éliminer les taches tenaces et raviver les couleurs.',
    
    'service.vitres.title': 'Nettoyage de Vitres',
    'service.vitres.description': 'Des vitres cristallines pour une luminosité optimale.',
    'service.vitres.details': 'Nettoyage professionnel sans traces pour tous types de fenêtres et baies vitrées.',
    
    'service.terrasse.title': 'Nettoyage de Terrasses',
    'service.terrasse.description': 'Redonnez vie à vos espaces extérieurs avec notre nettoyage haute pression.',
    'service.terrasse.details': 'Élimination des mousses, lichens et salissures pour une terrasse comme neuve.',
    
    'service.toiture.title': 'Nettoyage de Toitures',
    'service.toiture.description': 'Protégez et embellissez votre toiture avec notre service spécialisé.',
    'service.toiture.details': 'Nettoyage professionnel pour prolonger la durée de vie de votre toiture.',
    
    'service.bureaux.title': 'Nettoyage de Bureaux',
    'service.bureaux.description': 'Un environnement de travail propre et sain pour votre équipe.',
    'service.bureaux.details': 'Service de nettoyage professionnel pour espaces de travail et bureaux.',
    
    'service.domicile.title': 'Nettoyage à Domicile',
    'service.domicile.description': 'Service de ménage complet pour votre confort quotidien.',
    'service.domicile.details': 'Nettoyage général de votre domicile selon vos besoins spécifiques.',
    
    'service.billard.title': 'Nettoyage de Billards',
    'service.billard.description': 'Maintenez votre table de billard en parfait état.',
    'service.billard.details': 'Nettoyage spécialisé du tapis et entretien de votre table de billard.',
    
    'service.shampoinage.title': 'Shampoinage de Sièges',
    'service.shampoinage.description': 'Sièges de voiture et mobilier textile comme neufs.',
    'service.shampoinage.details': 'Shampoinage professionnel pour tous types de sièges et tissus.',
    
     // About
     'about.title': 'À Propos de Nous',
     'about.subtitle': 'Votre partenaire de confiance pour un environnement propre',
     'about.description': "À 22 ans, jeune Syrien en Valais, j'ai créé en 2024 une entreprise de nettoyage mobile, apportant mes machines chez les clients pour un service pratique, complet et de haute qualité.",
     'about.experience': 'ans d\'expérience',
     'about.clients': 'clients satisfaits',
     'about.guarantee': 'garantie qualité',
     'about.learn_more': 'En savoir plus',
     'about.our_story': 'Notre Histoire',
     'about.contact_us': 'Nous contacter',
     'about.how_born': 'Comment MonHygiène est né ?',
     'about.close_modal': 'Fermer',
     'about.content1': "Jeune entrepreneur valaisan, j'ai décidé, à 22 ans, de mettre ma passion pour l'entrepreneuriat en pratique. En février 2024, après une formation continue qui m'a permis d'acquérir des compétences essentielles, j'ai fondé mon entreprise de nettoyage sur mesure.",
     'about.content2': "Installé en Valais depuis 9 ans, j'ai constaté un besoin chez les clients : la difficulté de transporter leurs meubles jusqu'à un atelier de nettoyage.",
     'about.content3': "Pour répondre à ce besoin, j'ai créé un concept innovant. Plutôt que de demander à mes clients de déplacer leurs meubles, je viens directement à leur domicile avec mes machines professionnelles.",
     'about.content4': "Mon entreprise propose des services de nettoyage pour canapés, matelas, tapis, moquettes, intérieurs et extérieurs de voitures, fenêtres, terrasses, balcons, sièges en tissu, tables de billard et bien plus encore.",
     'about.content5': "Mon objectif est de simplifier la vie de mes clients en leur offrant un service de qualité qui élimine toutes les taches et odeurs, sans qu'ils aient besoin de se déplacer. À travers cette approche, je suis déterminé à leur offrir une expérience de nettoyage supérieure et pratique directement à domicile.",
     
     // How it works
    'how.title': 'Comment ça marche',
    'how.subtitle': 'Un processus simple en 3 étapes',
    'how.step1.title': 'Réservation en ligne',
    'how.step1.desc': 'Choisissez la prestation qui vous convient directement via notre plateforme et sélectionnez la date de votre choix.',
    'how.step2.title': 'Confirmation',
    'how.step2.desc': 'Après votre réservation, nous vous contacterons par téléphone ou via WhatsApp afin de valider ensemble les derniers détails.',
    'how.step3.title': 'Intervention à domicile',
    'how.step3.desc': 'Nous nous déplaçons chez vous avec notre matériel professionnel et nous occupons intégralement du nettoyage sur place.',
     'how.pricing.title': 'Frais de déplacement',
     'how.pricing.free': 'Les déplacements dans un rayon de 5 km autour de Sion sont offerts.',
     'how.pricing.beyond': 'Au-delà de cette zone, un tarif de 0.75 CHF par kilomètre (trajet aller uniquement) est appliqué jusqu\'à votre domicile.',
     
     // Service Details Pricing
     'pricing.travel_costs': 'Frais de déplacement',
     'pricing.free_radius': 'Gratuit dans un rayon de 5 km autour de Sion. Sinon, CHF 0.75/km (aller simple).',
     'pricing.free_radius_detailed': 'Gratuit dans un rayon de 5 km autour de notre siège à Sion (Valais).',
     'pricing.beyond_detailed': 'Au-delà de 5 km : CHF 0.75/km (aller simple).',
     'pricing.example': 'Exemple : Sion → Martigny = CHF 20.25 à ajouter au tarif.',
     'pricing.unique_rate': 'Tarif unique',
     'pricing.cleaning_rates': 'Tarifs de nettoyage',
    
    // Gallery
    'gallery.title': 'Nos Réalisations',
    'gallery.subtitle': 'Découvrez la qualité de notre travail à travers nos réalisations',
    'gallery.view_more': 'Voir plus',
    'gallery.before': 'Avant',
    'gallery.after': 'Après',
    
    // Video Section
    'video.title': 'Découvrez MonHygiène en action',
    'video.subtitle': 'Regardez comment nous transformons vos espaces avec professionnalisme',
    
    // Reviews
    'reviews.title': 'Nos',
    'reviews.subtitle': 'Témoignages authentiques de nos clients satisfaits',
    'reviews.rating': 'étoiles',
    'reviews.verified': 'Avis vérifié',
    
    // Stats
    'stats.title': 'Nos',
    'stats.clients': 'Clients Satisfaits',
    'stats.interventions': 'Interventions Réalisées',
    'stats.experience': 'Années d\'Expérience',
    'stats.rating': 'Note Moyenne',
    'stats.plus': '+',
    
    // CTA
    'cta.title': 'Prêt à transformer votre espace ?',
    'cta.subtitle': 'Contactez-nous dès aujourd\'hui pour un devis gratuit et personnalisé',
    'cta.button': 'Obtenir un devis gratuit',
    'cta.phone': 'Appelez-nous',
    'cta.whatsapp': 'WhatsApp',
    'cta.or': 'ou',
    
    // Footer
    'footer.title': 'Contactez-nous',
    'footer.contact': 'Contact',
    'footer.services': 'Services',
    'footer.follow': 'Suivez-nous',
    'footer.rights': 'Tous droits réservés',
    'footer.description': 'Votre partenaire de confiance pour tous vos besoins de nettoyage professionnel en Suisse.',
    'footer.quick_links': 'Liens rapides',
    'footer.address': 'Adresse',
    'footer.phone': 'Téléphone',
    'footer.email': 'Email',
    'footer.location': 'Localisation',
    'footer.contact_info': 'Informations de contact',
    'footer.send_message': 'Envoyez-nous un message',
    'footer.your_name': 'Votre nom',
    'footer.your_email': 'Votre email',
    'footer.your_message': 'Votre message',
    'footer.send': 'Envoyer',
    'footer.message_sent': 'Message envoyé !',
    'footer.message_response': 'Nous vous répondrons dans les plus brefs délais.',
    'footer.designed_with': 'Conçu avec',
    'footer.by': 'par',
    
    // Trust section
    'trust.title': 'Ils nous ont fait confiance et sont satisfaits :',
    'trust.valais': 'État du Valais',
    'trust.logo_coming': 'logo à venir',
    
    // WhatsApp
    'whatsapp.message': 'Besoin d\'aide ? Contactez-nous !',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.success': 'Succès !',
    'common.close': 'Fermer',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.finish': 'Terminer',
    'common.select': 'Sélectionner',
    'common.choose': 'Choisir',
    'common.book_now': 'Réserver maintenant',
    'common.get_quote': 'Obtenir un devis'
  },
  de: {
    // Navigation
    'nav.services': 'Dienstleistungen',
    'nav.about': 'Über uns',
    'nav.gallery': 'Galerie',
    'nav.reviews': 'Bewertungen',
    'nav.contact': 'Kontakt',
    'nav.reservation': 'Reservierung',
    
    // Hero Section
    'hero.title': 'Ihr Vertrauensvoller Partner für Professionelle Reinigung',
    'hero.subtitle': 'Außergewöhnliche Reinigungsdienste für Privatpersonen und Unternehmen im Wallis',
    'hero.cta': 'Jetzt buchen',
    'hero.contact': 'Kontaktieren Sie uns',
    'hero.description': 'Entdecken Sie unsere professionellen und personalisierten Reinigungsdienste',
    
    // Services
    'services.title': 'Unsere Dienstleistungen',
    'services.subtitle': 'Professionelle Reinigungslösungen für alle Ihre Bedürfnisse',
    'services.cta': 'Alle Dienste anzeigen',
    'services.book': 'Buchen',
    'services.from': 'Ab',
    'services.chf': 'CHF',
    'services.contact_price': 'Preis auf Anfrage',
    
    // Service Details
    'service.canape.title': 'Sofa-Reinigung',
    'service.canape.description': 'Erwecken Sie Ihre Sofas mit unserem professionellen Reinigungsservice zu Hause zum Leben.',
    'service.canape.details': 'Unser Sofa-Reinigungsservice verwendet fortschrittliche Techniken zur Entfernung von Flecken, Gerüchen und Allergenen.',
    
    'service.matelas.title': 'Matratzen-Reinigung',
    'service.matelas.description': 'Gesunder Schlaf beginnt mit einer sauberen Matratze. Profitieren Sie von unserer Expertise.',
    'service.matelas.details': 'Wir eliminieren Milben, Bakterien und schlechte Gerüche für eine optimale Schlafumgebung.',
    
    'service.vehicule.title': 'Fahrzeug-Reinigung',
    'service.vehicule.description': 'Innen und außen, bringen Sie Ihr Auto mit unserem mobilen Service zum Glänzen.',
    'service.vehicule.details': 'Vollständiger Autoreinigungsservice zu Hause: Innenraum, Außenbereich und Detailing.',
    
    'service.tapis.title': 'Teppich- & Moquette-Reinigung',
    'service.tapis.description': 'Finden Sie die ursprüngliche Schönheit Ihrer Teppiche und Moquettes wieder.',
    'service.tapis.details': 'Professionelle Techniken zur Entfernung hartnäckiger Flecken und Wiederbelebung der Farben.',
    
    'service.vitres.title': 'Fenster-Reinigung',
    'service.vitres.description': 'Kristallklare Fenster für optimale Helligkeit.',
    'service.vitres.details': 'Professionelle streifenfreie Reinigung für alle Arten von Fenstern und Glasfronten.',
    
    'service.terrasse.title': 'Terrassen-Reinigung',
    'service.terrasse.description': 'Erwecken Sie Ihre Außenbereiche mit unserer Hochdruckreinigung zum Leben.',
    'service.terrasse.details': 'Entfernung von Moos, Flechten und Verschmutzungen für eine wie neue Terrasse.',
    
    'service.toiture.title': 'Dach-Reinigung',
    'service.toiture.description': 'Schützen und verschönern Sie Ihr Dach mit unserem spezialisierten Service.',
    'service.toiture.details': 'Professionelle Reinigung zur Verlängerung der Lebensdauer Ihres Daches.',
    
    'service.bureaux.title': 'Büro-Reinigung',
    'service.bureaux.description': 'Eine saubere und gesunde Arbeitsumgebung für Ihr Team.',
    'service.bureaux.details': 'Professioneller Reinigungsservice für Arbeitsplätze und Büros.',
    
    'service.domicile.title': 'Hausreinigung',
    'service.domicile.description': 'Kompletter Reinigungsservice für Ihren täglichen Komfort.',
    'service.domicile.details': 'Allgemeine Reinigung Ihres Zuhauses nach Ihren spezifischen Bedürfnissen.',
    
    'service.billard.title': 'Billard-Reinigung',
    'service.billard.description': 'Halten Sie Ihren Billardtisch in perfektem Zustand.',
    'service.billard.details': 'Spezialisierte Reinigung des Tuchs und Wartung Ihres Billardtisches.',
    
    'service.shampoinage.title': 'Sitz-Shampoonierung',
    'service.shampoinage.description': 'Autositze und Textilmöbel wie neu.',
    'service.shampoinage.details': 'Professionelle Shampoonierung für alle Arten von Sitzen und Geweben.',
    
    // About
    'about.title': 'Über uns',
    'about.subtitle': 'Ihr vertrauensvoller Partner für eine saubere Umgebung',
    'about.description': 'Als 22-jähriger junger Syrer im Wallis gründete ich 2024 ein mobiles Reinigungsunternehmen und bringe meine Maschinen zu den Kunden für einen praktischen, umfassenden und hochwertigen Service.',
    'about.experience': 'Jahre Erfahrung',
    'about.clients': 'zufriedene Kunden',
    'about.guarantee': 'Qualitätsgarantie',
    'about.learn_more': 'Mehr erfahren',
    'about.our_story': 'Unsere Geschichte',
    'about.contact_us': 'Kontaktieren Sie uns',
    'about.how_born': 'Wie MonHygiène entstanden ist?',
    'about.close_modal': 'Schließen',
    'about.content1': 'Als junger Walliser Unternehmer entschied ich im Alter von 22 Jahren, meine Leidenschaft für das Unternehmertum in die Praxis umzusetzen. Im Februar 2024, nach einer Weiterbildung, die es mir ermöglichte, wesentliche Fähigkeiten zu erwerben, gründete ich mein maßgeschneidertes Reinigungsunternehmen.',
    'about.content2': 'Seit 9 Jahren im Wallis ansässig, stellte ich einen Bedarf bei den Kunden fest: die Schwierigkeit, ihre Möbel zu einer Reinigungswerkstatt zu transportieren.',
    'about.content3': 'Um diesem Bedarf gerecht zu werden, schuf ich ein innovatives Konzept. Anstatt meine Kunden zu bitten, ihre Möbel zu bewegen, komme ich direkt zu ihrem Zuhause mit meinen professionellen Maschinen.',
    'about.content4': 'Mein Unternehmen bietet Reinigungsdienste für Sofas, Matratzen, Teppiche, Moquettes, Auto-Innen- und Außenbereich, Fenster, Terrassen, Balkone, Stoffsitze, Billardtische und vieles mehr.',
    'about.content5': 'Mein Ziel ist es, das Leben meiner Kunden zu vereinfachen, indem ich ihnen einen Qualitätsservice biete, der alle Flecken und Gerüche beseitigt, ohne dass sie sich bewegen müssen. Durch diesen Ansatz bin ich entschlossen, ihnen eine überlegene und praktische Reinigungserfahrung direkt zu Hause zu bieten.',
    
    // How it works
    'how.title': 'So funktioniert es',
    'how.subtitle': 'Ein einfacher Prozess in 3 Schritten',
    'how.step1.title': 'Online-Buchung',
    'how.step1.desc': 'Wählen Sie die gewünschte Dienstleistung direkt über unsere Plattform und wählen Sie Ihren Wunschtermin.',
    'how.step2.title': 'Bestätigung',
    'how.step2.desc': 'Nach Ihrer Buchung kontaktieren wir Sie telefonisch oder über WhatsApp, um gemeinsam die letzten Details zu bestätigen.',
    'how.step3.title': 'Hausbesuch',
    'how.step3.desc': 'Wir kommen mit unserer professionellen Ausrüstung zu Ihnen und kümmern uns vollständig um die Reinigung vor Ort.',
    'how.pricing.title': 'Anfahrtskosten',
    'how.pricing.free': 'Anfahrten in einem Umkreis von 5 km um Sitten sind kostenlos.',
    'how.pricing.beyond': 'Außerhalb dieser Zone wird ein Tarif von 0,75 CHF pro Kilometer (nur Hinfahrt) bis zu Ihrem Wohnort angewendet.',
    
    // Service Details Pricing
    'pricing.travel_costs': 'Anfahrtskosten',
    'pricing.free_radius': 'Kostenlos in einem Umkreis von 5 km um Sitten. Sonst CHF 0,75/km (einfach).',
    'pricing.free_radius_detailed': 'Kostenlos in einem Umkreis von 5 km um unseren Sitz in Sitten (Wallis).',
    'pricing.beyond_detailed': 'Außerhalb von 5 km: CHF 0,75/km (einfach).',
    'pricing.example': 'Beispiel: Sitten → Martigny = CHF 20,25 zum Tarif hinzufügen.',
    'pricing.unique_rate': 'Einheitstarif',
    'pricing.cleaning_rates': 'Reinigungstarife',
    
    // Gallery
    'gallery.title': 'Unsere Arbeiten',
    'gallery.subtitle': 'Entdecken Sie die Qualität unserer Arbeit durch unsere Realisierungen',
    'gallery.view_more': 'Mehr anzeigen',
    'gallery.before': 'Vorher',
    'gallery.after': 'Nachher',
    
    // Video Section
    'video.title': 'Entdecken Sie MonHygiène in Aktion',
    'video.subtitle': 'Sehen Sie, wie wir Ihre Räume mit Professionalität verwandeln',
    
    // Reviews
    'reviews.title': 'Was unsere Kunden sagen',
    'reviews.subtitle': 'Authentische Testimonials unserer zufriedenen Kunden',
    'reviews.rating': 'Sterne',
    'reviews.verified': 'Verifizierte Bewertung',
    
    // Stats
    'stats.title': 'Unsere Zahlen',
    'stats.clients': 'Zufriedene Kunden',
    'stats.interventions': 'Durchgeführte Interventionen',
    'stats.experience': 'Jahre Erfahrung',
    'stats.rating': 'Durchschnittsbewertung',
    'stats.plus': '+',
    
    // CTA
    'cta.title': 'Bereit, Ihren Raum zu verwandeln?',
    'cta.subtitle': 'Kontaktieren Sie uns noch heute für ein kostenloses und personalisiertes Angebot',
    'cta.button': 'Kostenloses Angebot erhalten',
    'cta.phone': 'Rufen Sie uns an',
    'cta.whatsapp': 'WhatsApp',
    'cta.or': 'oder',
    
    // Footer
    'footer.title': 'Kontaktieren Sie uns',
    'footer.contact': 'Kontakt',
    'footer.services': 'Dienstleistungen',
    'footer.follow': 'Folgen Sie uns',
    'footer.rights': 'Alle Rechte vorbehalten',
    'footer.description': 'Ihr vertrauensvoller Partner für alle Ihre professionellen Reinigungsbedürfnisse in der Schweiz.',
    'footer.quick_links': 'Schnelle Links',
    'footer.address': 'Adresse',
    'footer.phone': 'Telefon',
    'footer.email': 'E-Mail',
    'footer.location': 'Standort',
    'footer.contact_info': 'Kontaktinformationen',
    'footer.send_message': 'Senden Sie uns eine Nachricht',
    'footer.your_name': 'Ihr Name',
    'footer.your_email': 'Ihre E-Mail',
    'footer.your_message': 'Ihre Nachricht',
    'footer.send': 'Senden',
    'footer.message_sent': 'Nachricht gesendet!',
    'footer.message_response': 'Wir werden Ihnen so schnell wie möglich antworten.',
    'footer.designed_with': 'Entworfen mit',
    'footer.by': 'von',
    
    // Trust section
    'trust.title': 'Sie haben uns vertraut und sind zufrieden:',
    'trust.valais': 'Staat Wallis',
    'trust.logo_coming': 'Logo kommt',
    
    // WhatsApp
    'whatsapp.message': 'Brauchen Sie Hilfe? Kontaktieren Sie uns!',
    
    // Common
    'common.loading': 'Laden...',
    'common.error': 'Ein Fehler ist aufgetreten',
    'common.success': 'Erfolg!',
    'common.close': 'Schließen',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.confirm': 'Bestätigen',
    'common.next': 'Weiter',
    'common.previous': 'Zurück',
    'common.finish': 'Beenden',
    'common.select': 'Auswählen',
    'common.choose': 'Wählen',
    'common.book_now': 'Jetzt buchen',
    'common.get_quote': 'Angebot erhalten'
  },
  en: {
    // Navigation
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.gallery': 'Gallery',
    'nav.reviews': 'Reviews',
    'nav.contact': 'Contact',
    'nav.reservation': 'Reservation',
    
    // Hero Section
    'hero.title': 'Your Trusted Partner for Professional Cleaning',
    'hero.subtitle': 'Exceptional cleaning services for individuals and businesses in Valais',
    'hero.cta': 'Book now',
    'hero.contact': 'Contact us',
    'hero.description': 'Discover our professional and personalized cleaning services',
    
    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Professional cleaning solutions tailored to all your needs',
    'services.cta': 'View all services',
    'services.book': 'Book',
    'services.from': 'From',
    'services.chf': 'CHF',
    'services.contact_price': 'Price on request',
    
    // Service Details
    'service.canape.title': 'Sofa Cleaning',
    'service.canape.description': 'Bring your sofas back to life with our professional home cleaning service.',
    'service.canape.details': 'Our sofa cleaning service uses advanced techniques to eliminate stains, odors and allergens.',
    
    'service.matelas.title': 'Mattress Cleaning',
    'service.matelas.description': 'Healthy sleep starts with a clean mattress. Benefit from our expertise.',
    'service.matelas.details': 'We eliminate dust mites, bacteria and bad odors for an optimal sleep environment.',
    
    'service.vehicule.title': 'Vehicle Cleaning',
    'service.vehicule.description': 'Interior and exterior, restore your car\'s shine with our mobile service.',
    'service.vehicule.details': 'Complete car cleaning service at home: interior, exterior, and detailing.',
    
    'service.tapis.title': 'Carpet & Rug Cleaning',
    'service.tapis.description': 'Rediscover the original beauty of your carpets and rugs.',
    'service.tapis.details': 'Professional techniques to remove stubborn stains and revive colors.',
    
    'service.vitres.title': 'Window Cleaning',
    'service.vitres.description': 'Crystal clear windows for optimal brightness.',
    'service.vitres.details': 'Professional streak-free cleaning for all types of windows and glass panels.',
    
    'service.terrasse.title': 'Terrace Cleaning',
    'service.terrasse.description': 'Bring your outdoor spaces back to life with our pressure washing.',
    'service.terrasse.details': 'Removal of moss, lichen and dirt for a like-new terrace.',
    
    'service.toiture.title': 'Roof Cleaning',
    'service.toiture.description': 'Protect and beautify your roof with our specialized service.',
    'service.toiture.details': 'Professional cleaning to extend the life of your roof.',
    
    'service.bureaux.title': 'Office Cleaning',
    'service.bureaux.description': 'A clean and healthy work environment for your team.',
    'service.bureaux.details': 'Professional cleaning service for workspaces and offices.',
    
    'service.domicile.title': 'Home Cleaning',
    'service.domicile.description': 'Complete cleaning service for your daily comfort.',
    'service.domicile.details': 'General cleaning of your home according to your specific needs.',
    
    'service.billard.title': 'Pool Table Cleaning',
    'service.billard.description': 'Keep your pool table in perfect condition.',
    'service.billard.details': 'Specialized cleaning of the felt and maintenance of your pool table.',
    
    'service.shampoinage.title': 'Seat Shampooing',
    'service.shampoinage.description': 'Car seats and textile furniture like new.',
    'service.shampoinage.details': 'Professional shampooing for all types of seats and fabrics.',
    
    // About
    'about.title': 'About Us',
    'about.subtitle': 'Your trusted partner for a clean environment',
    'about.description': 'At 22, young Syrian in Valais, I created in 2024 a mobile cleaning company, bringing my machines to customers for a practical, complete and high-quality service.',
    'about.experience': 'years of experience',
    'about.clients': 'satisfied clients',
    'about.guarantee': 'quality guarantee',
    'about.learn_more': 'Learn more',
    'about.our_story': 'Our Story',
    'about.contact_us': 'Contact us',
    'about.how_born': 'How MonHygiène was born?',
    'about.close_modal': 'Close',
    'about.content1': 'As a young Valais entrepreneur, I decided at 22 to put my passion for entrepreneurship into practice. In February 2024, after continuing education that allowed me to acquire essential skills, I founded my custom cleaning company.',
    'about.content2': 'Living in Valais for 9 years, I noticed a need among clients: the difficulty of transporting their furniture to a cleaning workshop.',
    'about.content3': 'To meet this need, I created an innovative concept. Rather than asking my clients to move their furniture, I come directly to their home with my professional machines.',
    'about.content4': 'My company offers cleaning services for sofas, mattresses, carpets, car interiors and exteriors, windows, terraces, balconies, fabric seats, pool tables and much more.',
    'about.content5': 'My goal is to simplify my clients\' lives by offering them a quality service that eliminates all stains and odors, without them having to move. Through this approach, I am determined to offer them a superior and practical cleaning experience directly at home.',
    
    // How it works
    'how.title': 'How it works',
    'how.subtitle': 'A simple 3-step process',
    'how.step1.title': 'Online booking',
    'how.step1.desc': 'Choose the service that suits you directly via our platform and select your preferred date.',
    'how.step2.title': 'Confirmation',
    'how.step2.desc': 'After your booking, we will contact you by phone or via WhatsApp to validate the final details together.',
    'how.step3.title': 'Home intervention',
    'how.step3.desc': 'We come to your home with our professional equipment and take complete care of the cleaning on site.',
    'how.pricing.title': 'Travel costs',
    'how.pricing.free': 'Travel within a 5 km radius around Sion is free.',
    'how.pricing.beyond': 'Beyond this zone, a rate of 0.75 CHF per kilometer (outbound journey only) is applied to your home.',
    
    // Service Details Pricing
    'pricing.travel_costs': 'Travel costs',
    'pricing.free_radius': 'Free within a 5 km radius around Sion. Otherwise CHF 0.75/km (one way).',
    'pricing.free_radius_detailed': 'Free within a 5 km radius around our headquarters in Sion (Valais).',
    'pricing.beyond_detailed': 'Beyond 5 km: CHF 0.75/km (one way).',
    'pricing.example': 'Example: Sion → Martigny = CHF 20.25 to add to the rate.',
    'pricing.unique_rate': 'Fixed rate',
    'pricing.cleaning_rates': 'Cleaning rates',
    
    // Gallery
    'gallery.title': 'Our Work',
    'gallery.subtitle': 'Discover the quality of our work through our achievements',
    'gallery.view_more': 'View more',
    'gallery.before': 'Before',
    'gallery.after': 'After',
    
    // Video Section
    'video.title': 'Discover MonHygiène in action',
    'video.subtitle': 'Watch how we transform your spaces with professionalism',
    
    // Reviews
    'reviews.title': 'What our customers say',
    'reviews.subtitle': 'Authentic testimonials from our satisfied customers',
    'reviews.rating': 'stars',
    'reviews.verified': 'Verified review',
    
    // Stats
    'stats.title': 'Our Numbers',
    'stats.clients': 'Satisfied Clients',
    'stats.interventions': 'Completed Interventions',
    'stats.experience': 'Years of Experience',
    'stats.rating': 'Average Rating',
    'stats.plus': '+',
    
    // CTA
    'cta.title': 'Ready to transform your space?',
    'cta.subtitle': 'Contact us today for a free and personalized quote',
    'cta.button': 'Get free quote',
    'cta.phone': 'Call us',
    'cta.whatsapp': 'WhatsApp',
    'cta.or': 'or',
    
    // Footer
    'footer.title': 'Contact us',
    'footer.contact': 'Contact',
    'footer.services': 'Services',
    'footer.follow': 'Follow us',
    'footer.rights': 'All rights reserved',
    'footer.description': 'Your trusted partner for all your professional cleaning needs in Switzerland.',
    'footer.quick_links': 'Quick links',
    'footer.address': 'Address',
    'footer.phone': 'Phone',
    'footer.email': 'Email',
    'footer.location': 'Location',
    'footer.contact_info': 'Contact information',
    'footer.send_message': 'Send us a message',
    'footer.your_name': 'Your name',
    'footer.your_email': 'Your email',
    'footer.your_message': 'Your message',
    'footer.send': 'Send',
    'footer.message_sent': 'Message sent!',
    'footer.message_response': 'We will get back to you as soon as possible.',
    'footer.designed_with': 'Designed with',
    'footer.by': 'by',
    
    // Trust section
    'trust.title': 'They trusted us and are satisfied:',
    'trust.valais': 'State of Valais',
    'trust.logo_coming': 'logo coming',
    
    // WhatsApp
    'whatsapp.message': 'Need help? Contact us!',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.finish': 'Finish',
    'common.select': 'Select',
    'common.choose': 'Choose',
    'common.book_now': 'Book now',
    'common.get_quote': 'Get quote'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const getLanguageFromPath = (): Language => {
    const pathSegments = location.pathname.split('/');
    const langCode = pathSegments[1];
    if (langCode === 'de' || langCode === 'en') return langCode;
    return 'fr';
  };

  const language = getLanguageFromPath();
  
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};