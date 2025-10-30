import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ChefHat, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Volume2, 
  VolumeX,
  Lightbulb,
  AlertTriangle,
  Pause,
  Play,
  RotateCcw,
  X,
  Moon,
  Sun,
  Maximize2,
  FileText,
  Target,
  Timer,
} from 'lucide-react';
import CookingTimer from './CookingTimer';
import PrepChecklist from './PrepChecklist';
import { 
  CookingStep, 
  PrepIngredient, 
  CookingSession,
  parseCookingSteps,
  formatTime,
  scaleMeasure,
} from '@/utils/cookingSteps';
import { getIngredients, Meal } from '@/services/mealApi';
import { useToast } from '@/hooks/use-toast';

interface CookingModeProps {
  recipe: Meal;
  isOpen: boolean;
  onClose: () => void;
}

const SESSION_STORAGE_KEY = 'cooking-session';

const CookingMode: React.FC<CookingModeProps> = ({ recipe, isOpen, onClose }) => {
  const { toast } = useToast();
  const [prepCompleted, setPrepCompleted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<CookingStep[]>([]);
  const [prepIngredients, setPrepIngredients] = useState<PrepIngredient[]>([]);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  // Mirror global theme on <html> to avoid mismatch with page theme
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  const [largeText, setLargeText] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalPausedTime, setTotalPausedTime] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [timerCompleted, setTimerCompleted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Keep in sync with global root class
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    // run once and when storage changes from other parts
    check();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'color-scheme') check();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    const next = !root.classList.contains('dark');
    if (next) {
      root.classList.add('dark');
      window.localStorage.setItem('color-scheme', 'dark');
    } else {
      root.classList.remove('dark');
      window.localStorage.setItem('color-scheme', 'light');
    }
    setIsDark(next);
  };

  // Load session on mount
  useEffect(() => {
    if (isOpen && recipe) {
      const savedSession = localStorage.getItem(`${SESSION_STORAGE_KEY}-${recipe.idMeal}`);
      if (savedSession) {
        try {
          const session: CookingSession = JSON.parse(savedSession);
          if (session.prepCompleted && session.cookingStarted) {
            setPrepCompleted(true);
            setCurrentStepIndex(session.currentStep);
            setScaleFactor(session.scaleFactor);
            setNotes(session.notes || {});
            setStartTime(Date.now() - (session.totalPausedTime * 1000));
          }
        } catch (e) {
          console.error('Failed to load session', e);
        }
      }

      // Parse steps from instructions
      const ingredientsList = getIngredients(recipe).map(i => i.ingredient);
      const parsedSteps = parseCookingSteps(recipe.strInstructions, ingredientsList);
      setSteps(parsedSteps);

      // Prepare ingredients list
      const prepList: PrepIngredient[] = getIngredients(recipe)
        .filter(i => i.ingredient && i.ingredient.trim())
        .map(i => ({
          name: i.ingredient,
          measure: i.measure || '',
          prepared: false,
        }));
      setPrepIngredients(prepList);
    }
  }, [isOpen, recipe]);

  // Save session
  const saveSession = () => {
    if (!recipe) return;
    
    const session: CookingSession = {
      recipeId: recipe.idMeal,
      recipeName: recipe.strMeal,
      currentStep: currentStepIndex,
      prepCompleted,
      cookingStarted: prepCompleted && currentStepIndex > 0,
      startTime: startTime || Date.now(),
      pausedTime: pauseStartTime || 0,
      totalPausedTime: totalPausedTime + (pauseStartTime ? (Date.now() - pauseStartTime) / 1000 : 0),
      scaleFactor,
      notes,
    };
    
    localStorage.setItem(`${SESSION_STORAGE_KEY}-${recipe.idMeal}`, JSON.stringify(session));
  };

  useEffect(() => {
    if (recipe) {
      saveSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, prepCompleted, scaleFactor, notes, isPaused]);

  // Voice read-aloud
  const speakText = (text: string) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
    
    // Cancel previous utterance
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }
  };

  // Timer completion
  const handleTimerComplete = () => {
    setTimerCompleted(true);
    toast({
      title: "Time's Up!",
      description: steps[currentStepIndex]?.instruction || "Step completed",
    });
    
    // Play notification sound if possible
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTq66hVFApGn+DyvmwhBTSBy/LdiTYIGWi97+OcShAMT6jh8LZhGgU4j9TyzXgsBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQU0gcvz3Ik2CBmove/jnEoQDE+o4fC2YRoFOI/U8s14LAUkd8fw3ZBACg==');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {
      // Ignore audio errors
    }
  };

  // Navigation
  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setTimerCompleted(false);
      stopVoice(); // Stop current voice
      const nextStep = steps[nextIndex];
      if (nextStep && isVoiceEnabled && !isPaused) {
        speakText(`Step ${nextStep.stepNumber}: ${nextStep.instruction}`);
      }
    } else {
      // Completed!
      handleComplete();
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      setTimerCompleted(false);
      stopVoice(); // Stop current voice
      const prevStep = steps[prevIndex];
      if (prevStep && isVoiceEnabled && !isPaused) {
        speakText(`Step ${prevStep.stepNumber}: ${prevStep.instruction}`);
      }
    }
  };

  const handleComplete = () => {
    toast({
      title: "🎉 Recipe Complete!",
      description: `You've successfully cooked ${recipe.strMeal}!`,
    });
    // Clear session
    localStorage.removeItem(`${SESSION_STORAGE_KEY}-${recipe.idMeal}`);
    onClose();
  };

  const handlePrepComplete = () => {
    setPrepCompleted(true);
    setStartTime(Date.now());
    if (steps.length > 0 && isVoiceEnabled) {
      speakText(`Starting step 1: ${steps[0].instruction}`);
    }
  };

  // Pause/Resume
  const handlePause = () => {
    setIsPaused(true);
    setPauseStartTime(Date.now());
    stopVoice();
  };

  const handleResume = () => {
    setIsPaused(false);
    if (pauseStartTime) {
      setTotalPausedTime(prev => prev + (Date.now() - pauseStartTime) / 1000);
      setPauseStartTime(null);
    }
    const currentStep = steps[currentStepIndex];
    if (currentStep && isVoiceEnabled) {
      speakText(currentStep.instruction);
    }
  };

  // Update note
  const handleNoteChange = (stepId: string, note: string) => {
    setNotes(prev => ({ ...prev, [stepId]: note }));
  };

  // Toggle step completion
  const toggleStepComplete = (stepId: string) => {
    setSteps(prev =>
      prev.map(step =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      )
    );
  };

  const currentStep = steps[currentStepIndex];
  const completedSteps = steps.filter(s => s.completed).length;
  const elapsedTime = startTime
    ? Math.floor((Date.now() - startTime - totalPausedTime * 1000 - (pauseStartTime ? Date.now() - pauseStartTime : 0)) / 1000)
    : 0;

  if (!isOpen || !recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className={`w-screen h-[100dvh] sm:max-w-6xl sm:max-h-[95vh] overflow-hidden p-0 rounded-none sm:rounded-lg ${isDark ? 'dark bg-gray-900' : 'bg-white'}`}>
        <DialogTitle className="sr-only">Cooking Mode</DialogTitle>
        <DialogDescription className="sr-only">Guided cooking steps, timers, and notes</DialogDescription>
        <div className={`flex flex-col h-[100dvh] sm:h-[95vh] ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-3 sm:p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full mr-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Back"
              >
                <ArrowLeft className={`h-5 w-5 ${isDark ? 'text-gray-100' : 'text-gray-700'}`} />
              </Button>
              <ChefHat className={`h-6 w-6 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
              <div>
                <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {recipe.strMeal}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    Step {currentStepIndex + 1} of {steps.length}
                  </Badge>
                  {currentStep && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        currentStep.difficulty === 'easy'
                          ? 'border-green-500 text-green-600'
                          : currentStep.difficulty === 'medium'
                          ? 'border-yellow-500 text-yellow-600'
                          : 'border-red-500 text-red-600'
                      }`}
                    >
                      {currentStep.difficulty}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Scale Factor */}
              <div className="flex items-center gap-1 border rounded-lg px-2 py-1 dark:border-gray-600">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setScaleFactor(Math.max(0.5, scaleFactor - 0.5))}
                  className="h-7 w-7 p-0 text-gray-700 dark:text-white"
                >
                  -
                </Button>
                <span className={`text-sm px-2 min-w-[3rem] text-center font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {scaleFactor}x
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setScaleFactor(Math.min(3, scaleFactor + 0.5))}
                  className="h-7 w-7 p-0 text-gray-700 dark:text-white"
                >
                  +
                </Button>
              </div>

              {/* Voice Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsVoiceEnabled(!isVoiceEnabled);
                  if (isVoiceEnabled) stopVoice();
                  else if (currentStep) speakText(currentStep.instruction);
                }}
                className="text-gray-700 dark:text-white"
              >
                {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>

              {/* Dark Mode */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="text-gray-700 dark:text-white"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Large Text */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLargeText(!largeText)}
                className="text-gray-700 dark:text-white"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>

              {/* Close button removed to avoid duplicate with dialog close control */}
            </div>
          </div>

          {/* Stats Bar */}
          {prepCompleted && (
            <div className={`flex items-center justify-between px-4 py-2 border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    {formatTime(elapsedTime)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    {completedSteps}/{steps.length} steps
                  </span>
                </div>
                {isPaused && (
                  <Badge variant="outline" className="bg-yellow-100 border-yellow-300">
                    Paused
                  </Badge>
                )}
              </div>
              
              {isPaused ? (
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
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {!prepCompleted ? (
              <PrepChecklist
                ingredients={prepIngredients}
                scaleFactor={scaleFactor}
                onComplete={handlePrepComplete}
              />
            ) : (
              currentStep && (
                <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                  {/* Current Step */}
              <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                    <CardContent className="p-6 space-y-6">
                      {/* Step Instruction */}
                      <div className="text-center space-y-4">
                        <div className={`font-bold ${largeText ? 'text-4xl' : 'text-3xl'} ${isDark ? 'text-white' : 'text-gray-800'}`}>
                          {currentStep.instruction}
                        </div>
                        
                        {/* Temperature Badge */}
                        {currentStep.temperature && (
                          <Badge className="bg-blue-500 text-white">
                            Temperature: {currentStep.temperature} heat
                          </Badge>
                        )}

                        {/* Ingredients in this step */}
                        {currentStep.ingredients && currentStep.ingredients.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-2">
                            {currentStep.ingredients.map((ing, idx) => (
                              <Badge key={idx} variant="outline" className="bg-orange-50 border-orange-200">
                                {ing}
                                {scaleFactor !== 1 && ` (${scaleFactor}x)`}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Timer */}
                      {currentStep.timerRequired && currentStep.timeSeconds && (
                        <div className="flex justify-center pt-4">
                          <CookingTimer
                            timeSeconds={currentStep.timeSeconds}
                            onComplete={handleTimerComplete}
                            isPaused={isPaused}
                            onPause={handlePause}
                            onResume={handleResume}
                          />
                          {timerCompleted && (
                            <Alert className="mt-4 bg-green-50 border-green-200">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <AlertDescription className="text-green-700">
                                Timer completed! Ready for next step.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}

                      {/* Tips & Warnings */}
                      <div className="space-y-3">
                        {currentStep.tip && (
                          <Alert className="bg-blue-50 border-blue-200">
                            <Lightbulb className="h-4 w-4 text-blue-500" />
                            <AlertDescription className="text-blue-700">
                              <strong>Tip:</strong> {currentStep.tip}
                            </AlertDescription>
                          </Alert>
                        )}
                        {currentStep.warning && (
                          <Alert className="bg-yellow-50 border-yellow-200">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <AlertDescription className="text-yellow-700">
                              <strong>Warning:</strong> {currentStep.warning}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <FileText className="h-4 w-4 inline mr-2" />
                          Your Notes:
                        </label>
                        <Input
                          placeholder="Add a note for this step..."
                          value={notes[currentStep.id] || ''}
                          onChange={(e) => handleNoteChange(currentStep.id, e.target.value)}
                          className={isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}
                        />
                      </div>

                      {/* Step Complete Checkbox */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant={currentStep.completed ? "default" : "outline"}
                          onClick={() => toggleStepComplete(currentStep.id)}
                          className={currentStep.completed ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                          {currentStep.completed ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Step Completed
                            </>
                          ) : (
                            'Mark as Complete'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Navigation */}
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                    <Button
                      onClick={handlePreviousStep}
                      disabled={currentStepIndex === 0}
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Previous
                    </Button>

                    <div className="text-center">
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Progress
                      </div>
                      <div className="w-64 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all"
                          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleNextStep}
                      disabled={isPaused}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    >
                      {currentStepIndex === steps.length - 1 ? (
                        <>
                          Complete <CheckCircle2 className="h-5 w-5 ml-2" />
                        </>
                      ) : (
                        <>
                          Next <ArrowRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Steps Overview */}
                  <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {steps.map((step, idx) => (
                          <Button
                            key={step.id}
                            variant={idx === currentStepIndex ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setCurrentStepIndex(idx);
                              setTimerCompleted(false);
                              stopVoice();
                              const selectedStep = steps[idx];
                              if (selectedStep && isVoiceEnabled && !isPaused) {
                                speakText(`Step ${selectedStep.stepNumber}: ${selectedStep.instruction}`);
                              }
                            }}
                            className={
                              idx === currentStepIndex
                                ? 'bg-orange-500 hover:bg-orange-600'
                                : step.completed
                                ? 'bg-green-100 border-green-300'
                                : ''
                            }
                          >
                            {idx + 1}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookingMode;

