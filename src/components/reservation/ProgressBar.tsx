
import { WizardStep } from '@/types/reservation';

interface ProgressBarProps {
  currentStep: WizardStep;
}

const steps: WizardStep[] = ['address', 'service', 'subthemes', 'schedule', 'contact'];

export const ProgressBar = ({ currentStep }: ProgressBarProps) => {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-3 left-0 w-full h-0.5 bg-gray-200">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                    isCompleted
                      ? 'bg-primary text-white'
                      : isCurrent
                      ? 'bg-primary text-white ring-4 ring-primary/20'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
