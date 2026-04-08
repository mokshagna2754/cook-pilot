export type Difficulty = "easy" | "medium" | "hard";

export interface CookingStep {
  id: string;
  stepNumber: number;
  instruction: string;
  ingredients: string[];
  timerRequired?: boolean;
  timeSeconds?: number;
  difficulty?: Difficulty;
  tip?: string;
  warning?: string;
  temperature?: string;
  completed?: boolean;
}

export interface PrepIngredient {
  name: string;
  measure: string;
  prepared: boolean;
}

export interface CookingSession {
  recipeId: string;
  recipeName: string;
  currentStep: number;
  prepCompleted: boolean;
  cookingStarted: boolean;
  startTime: number;
  pausedTime: number | 0;
  totalPausedTime: number;
  scaleFactor: number;
  notes: Record<string, string>;
}

// Convert a free-form instruction blob into structured steps.
export function parseCookingSteps(instructions: string, ingredientsList: string[] = []): CookingStep[] {
  if (!instructions) return [];

  // Split by newlines and sentences; keep non-empty trimmed items.
  const rawParts = instructions
    .split(/\r?\n|(?<=[.!?])\s+(?=[A-Z])/g)
    .map((s) => s.trim())
    .filter(Boolean);

  const steps: CookingStep[] = rawParts.map((text, idx) => {
    const lower = text.toLowerCase();

    // crude time extraction: "for 10 minutes", "10 min", "30 seconds"
    let seconds: number | undefined;
    const minuteMatch = lower.match(/(?:for\s*)?(\d{1,3})\s*(?:minutes|minute|mins|min)\b/);
    const secondMatch = lower.match(/(?:for\s*)?(\d{1,3})\s*(?:seconds|second|secs|sec)\b/);
    if (minuteMatch) seconds = parseInt(minuteMatch[1], 10) * 60;
    if (secondMatch) seconds = (seconds ?? 0) + parseInt(secondMatch[1], 10);

    const timerRequired = typeof seconds === "number" && seconds > 0;

    // naive difficulty heuristic based on verbs
    const difficulty: Difficulty = /whisk|knead|temper|caramelize|deglaze/.test(lower)
      ? "hard"
      : /simmer|reduce|roast|broil|saute|blend/.test(lower)
      ? "medium"
      : "easy";

    // collect ingredients mentioned in this step
    const ingredientsInStep = ingredientsList
      .filter(Boolean)
      .filter((ing) => lower.includes(ing.toLowerCase()))
      .slice(0, 8); // cap for UI sanity

    // crude temperature extraction (e.g. "medium heat", "high heat")
    const temp = lower.match(/(low|medium|high) heat/);

    return {
      id: `step-${idx + 1}`,
      stepNumber: idx + 1,
      instruction: text,
      ingredients: ingredientsInStep,
      timerRequired,
      timeSeconds: seconds,
      difficulty,
      temperature: temp ? temp[1] : undefined,
      completed: false,
    };
  });

  return steps;
}

export function formatTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Scale numeric values in a measure string by a factor (best-effort)
// e.g., "1.5 cups" x2 => "3 cups"
export function scaleMeasure(measure: string, factor: number): string {
  if (!measure || !isFinite(factor) || factor === 1) return measure;
  return measure.replace(/(?:(\d+\.?\d*)|(\.\d+))/g, (m) => {
    const val = parseFloat(m);
    if (Number.isNaN(val)) return m;
    const scaled = +(val * factor).toFixed(2);
    return `${scaled}`.replace(/\.00$/, "");
  });
}


