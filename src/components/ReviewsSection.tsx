import { useState, useEffect } from 'react';
import { Star, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {
    t,
    language
  } = useLanguage();
  const getReviews = () => {
    const baseReviews = {
      fr: [{
        id: 1,
        name: 'Renoa Tamimi',
        avatar: 'R',
        rating: 5,
        comment: "Service impeccable et travail très professionnel. L'équipe est à l'écoute, réactive et attentive aux détails. Je suis très satisfaite du résultat et je recommande vivement !"
      }, {
        id: 2,
        name: 'Abdallah Mustafa',
        avatar: 'A',
        rating: 5,
        comment: 'Franchement merci beaucoup la voiture est comme neuf je recommande fortement.'
      }, {
        id: 3,
        name: 'Marie-France Vouillamoz',
        avatar: 'M',
        rating: 5,
        comment: 'Entreprise sérieuse, qualifiée. Je ne peux que la recommander'
      }, {
        id: 4,
        name: 'Fardel Jonathan',
        avatar: 'F',
        rating: 5,
        comment: 'Services de nettoyage de haute qualité, rapide et consciencieux. Je ne peux que recommander ! Merci'
      }, {
        id: 5,
        name: 'Estelle Varone',
        avatar: 'E',
        rating: 5,
        comment: 'Service de nettoyage impeccable ! Je recommande vivement. Merci !'
      }, {
        id: 6,
        name: 'Grégoire Mousseau',
        avatar: 'G',
        rating: 5,
        comment: 'Efficace et à l\'écoute. Jeune homme sympathique, je recommande !'
      }, {
        id: 7,
        name: 'Gabriel Cheseaux',
        avatar: 'G',
        rating: 5,
        comment: 'Travail impeccable. Revenue comme neuf. Merci et encore bravo.'
      }, {
        id: 8,
        name: 'Awp balet',
        avatar: 'A',
        rating: 5,
        comment: 'Prix très abordable pour la qualité du travail. Je recommande!'
      }],
      de: [{
        id: 1,
        name: 'Renoa Tamimi',
        avatar: 'R',
        rating: 5,
        comment: "Tadelloser Service und sehr professionelle Arbeit. Das Team ist aufmerksam, reaktionsschnell und detailorientiert. Ich bin sehr zufrieden mit dem Ergebnis und empfehle es wärmstens!"
      }, {
        id: 2,
        name: 'Naz Kamrani',
        avatar: 'N',
        rating: 5,
        comment: "Ich habe meine Teppiche MonHygiène anvertraut und bin äußerst zufrieden mit dem Ergebnis. Sie kamen wie neu zurück, sauber, duftend und gut behandelt. Der Service ist professionell, schnell und sehr sorgfältig. Ich empfehle MonHygiène allen, die eine qualitativ hochwertige Reinigung wünschen!"
      }, {
        id: 3,
        name: 'Abdallah Mustafa',
        avatar: 'A',
        rating: 5,
        comment: 'Ehrlich gesagt, vielen Dank, das Auto ist wie neu, ich empfehle es sehr.'
      }, {
        id: 4,
        name: 'Marie-France Vouillamoz',
        avatar: 'M',
        rating: 5,
        comment: 'Seriöses, qualifiziertes Unternehmen. Ich kann es nur empfehlen'
      }, {
        id: 5,
        name: 'Fardel Jonathan',
        avatar: 'F',
        rating: 5,
        comment: 'Hochwertige Reinigungsdienstleistungen, schnell und gewissenhaft. Ich kann nur empfehlen! Danke'
      }, {
        id: 6,
        name: 'Estelle Varone',
        avatar: 'E',
        rating: 5,
        comment: 'Tadelloser Reinigungsservice! Ich empfehle es wärmstens. Danke!'
      }, {
        id: 7,
        name: 'Grégoire Mousseau',
        avatar: 'G',
        rating: 5,
        comment: 'Effizient und aufmerksam. Sympathischer junger Mann, ich empfehle!'
      }, {
        id: 8,
        name: 'Gabriel Cheseaux',
        avatar: 'G',
        rating: 5,
        comment: 'Tadellose Arbeit. Wie neu zurückgekommen. Danke und nochmals Bravo.'
      }, {
        id: 9,
        name: 'Awp balet',
        avatar: 'A',
        rating: 5,
        comment: 'Sehr erschwinglicher Preis für die Qualität der Arbeit. Ich empfehle!'
      }],
      en: [{
        id: 1,
        name: 'Renoa Tamimi',
        avatar: 'R',
        rating: 5,
        comment: "Impeccable service and very professional work. The team is attentive, responsive and detail-oriented. I am very satisfied with the result and highly recommend!"
      }, {
        id: 2,
        name: 'Naz Kamrani',
        avatar: 'N',
        rating: 5,
        comment: "I entrusted my carpets to MonHygiène and I am extremely satisfied with the result. They came back like new, clean, fragrant and well treated. The service is professional, fast and very careful. I highly recommend MonHygiène to anyone who wants quality cleaning!"
      }, {
        id: 3,
        name: 'Abdallah Mustafa',
        avatar: 'A',
        rating: 5,
        comment: 'Honestly thank you so much the car is like new I highly recommend.'
      }, {
        id: 4,
        name: 'Marie-France Vouillamoz',
        avatar: 'M',
        rating: 5,
        comment: 'Serious, qualified company. I can only recommend it'
      }, {
        id: 5,
        name: 'Fardel Jonathan',
        avatar: 'F',
        rating: 5,
        comment: 'High quality cleaning services, fast and conscientious. I can only recommend! Thank you'
      }, {
        id: 6,
        name: 'Estelle Varone',
        avatar: 'E',
        rating: 5,
        comment: 'Impeccable cleaning service! I highly recommend. Thank you!'
      }, {
        id: 7,
        name: 'Grégoire Mousseau',
        avatar: 'G',
        rating: 5,
        comment: 'Efficient and attentive. Nice young man, I recommend!'
      }, {
        id: 8,
        name: 'Gabriel Cheseaux',
        avatar: 'G',
        rating: 5,
        comment: 'Impeccable work. Came back like new. Thank you and bravo again.'
      }, {
        id: 9,
        name: 'Awp balet',
        avatar: 'A',
        rating: 5,
        comment: 'Very affordable price for the quality of work. I recommend!'
      }]
    };
    return baseReviews[language] || baseReviews.fr;
  };
  const reviews = getReviews();

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);
  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % reviews.length);
  };
  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + reviews.length) % reviews.length);
  };
  const renderStars = rating => {
    return [...Array(5)].map((_, index) => <Star key={index} className={`h-4 w-4 md:h-5 md:w-5 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />);
  };
  
  const getMoreReviewsText = () => {
    switch (language) {
      case 'de':
        return 'Mehr Bewertungen anzeigen';
      case 'en':
        return 'View more reviews';
      default:
        return "Voir plus d'avis";
    }
  };
  
  return <section id="reviews" className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-6 md:mb-8 tracking-tight">
            {t('reviews.title')} <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">{t('reviews.word')}</span>
          </h2>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t('reviews.subtitle')}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto mb-6 md:mb-8">
          <div className="flex items-center justify-center space-x-2 md:space-x-4">
            <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full w-10 h-10 md:w-14 md:h-14 transition-all duration-300 border-2 hover:border-primary z-10">
              <ChevronLeft className="h-5 w-5 md:h-7 md:w-7" />
            </Button>

            <div className="w-full max-w-2xl overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {reviews.map((review, index) => (
                  <div key={review.id} className="w-full flex-shrink-0">
                    <div className="bg-white rounded-3xl p-6 md:p-12 border-2 border-primary/10">
                      <div className="text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-2xl md:text-3xl mx-auto mb-4 md:mb-6">
                          {review.avatar}
                        </div>
                        
                        <h3 className="font-bold text-foreground text-lg md:text-2xl mb-2 md:mb-3">{review.name}</h3>
                        
                        <div className="flex justify-center space-x-1 mb-4 md:mb-6">
                          {renderStars(review.rating)}
                        </div>
                        
                        <p className="text-gray-900 leading-relaxed text-sm md:text-xl italic font-bold">
                          "{review.comment}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full w-10 h-10 md:w-14 md:h-14 transition-all duration-300 border-2 hover:border-primary z-10">
              <ChevronRight className="h-5 w-5 md:h-7 md:w-7" />
            </Button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center space-x-2 mt-1 md:mt-2">
            {reviews.map((_, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'}`} />)}
          </div>
        </div>

        <div className="text-center">
          <Button className="bg-primary hover:bg-primary/90 text-white px-6 md:px-10 py-3 md:py-4 text-base md:text-lg rounded-full shadow-lg inline-flex items-center space-x-2 md:space-x-3" onClick={() => window.open('https://maps.app.goo.gl/hEgB3TfHVFhyknp76', '_blank')}>
            <span>{getMoreReviewsText()}</span>
            <ExternalLink className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>
    </section>;
};
export default ReviewsSection;