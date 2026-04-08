import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { formatTime } from '@/utils/cookingSteps';

interface CookingTimerProps {
  timeSeconds: number;
  onComplete: () => void;
  onPause?: () => void;
  onResume?: () => void;
  isPaused?: boolean;
}

const CookingTimer: React.FC<CookingTimerProps> = ({
  timeSeconds,
  onComplete,
  onPause,
  onResume,
  isPaused = false,
}) => {
  const [remaining, setRemaining] = useState(timeSeconds);
  const [paused, setPaused] = useState(isPaused);

  useEffect(() => {
    setRemaining(timeSeconds);
    setPaused(isPaused);
  }, [timeSeconds, isPaused]);

  useEffect(() => {
    if (paused || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, remaining, onComplete]);

  const handlePause = () => {
    setPaused(true);
    onPause?.();
  };

  const handleResume = () => {
    setPaused(false);
    onResume?.();
  };

  const handleReset = () => {
    setRemaining(timeSeconds);
    setPaused(false);
  };

  const progress = timeSeconds > 0 ? ((timeSeconds - remaining) / timeSeconds) * 100 : 0;
  const isComplete = remaining === 0;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular Progress Timer */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className={`transition-all duration-1000 ${
              isComplete ? 'text-green-500' : remaining < 10 ? 'text-red-500 animate-pulse' : 'text-orange-500'
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className={`text-4xl font-bold ${isComplete ? 'text-green-500' : remaining < 10 ? 'text-red-500' : 'text-gray-800'}`}>
            {formatTime(remaining)}
          </div>
          {paused && (
            <div className="text-sm text-gray-500 mt-1">Paused</div>
          )}
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex gap-2">
        {!isComplete && (
          <>
            {paused ? (
              <Button onClick={handleResume} size="sm" className="bg-green-500 hover:bg-green-600">
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            ) : (
              <Button onClick={handlePause} size="sm" variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
          </>
        )}
        <Button onClick={handleReset} size="sm" variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CookingTimer;

