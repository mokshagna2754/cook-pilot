// Cooking moods and preferences
export const COOKING_MOODS = [
  { id: 'comfort', label: 'Comfort Food', icon: '🍲', keywords: ['comfort', 'warm', 'hearty', 'cozy'] },
  { id: 'healthy', label: 'Healthy & Fresh', icon: '🥗', keywords: ['healthy', 'fresh', 'light', 'nutritious'] },
  { id: 'spicy', label: 'Spicy & Bold', icon: '🌶️', keywords: ['spicy', 'hot', 'bold', 'fiery'] },
  { id: 'quick', label: 'Quick & Easy', icon: '⚡', keywords: ['quick', 'fast', 'easy', 'simple'] },
  { id: 'romantic', label: 'Romantic Dinner', icon: '💕', keywords: ['elegant', 'romantic', 'dinner', 'special'] },
  { id: 'breakfast', label: 'Breakfast', icon: '🥐', keywords: ['breakfast', 'morning', 'brunch'] },
  { id: 'dessert', label: 'Sweet Treats', icon: '🍰', keywords: ['dessert', 'sweet', 'cake', 'treat'] },
  { id: 'snack', label: 'Snacks', icon: '🍕', keywords: ['snack', 'appetizer', 'finger food'] },
];

export const COOKING_TIMES = [
  { id: 'quick', label: 'Quick (< 30 min)', maxMinutes: 30 },
  { id: 'medium', label: 'Medium (30-60 min)', minMinutes: 30, maxMinutes: 60 },
  { id: 'long', label: 'Long (> 60 min)', minMinutes: 60 },
];

export const DIETARY_PREFERENCES = [
  { id: 'vegetarian', label: 'Vegetarian', exclude: ['chicken', 'beef', 'pork', 'lamb', 'mutton', 'meat', 'fish'] },
  { id: 'vegan', label: 'Vegan', exclude: ['meat', 'dairy', 'egg', 'chicken', 'beef', 'pork', 'milk', 'cheese', 'butter'] },
  { id: 'non-vegetarian', label: 'Non-Vegetarian', prefer: ['chicken', 'fish', 'pork', 'lamb', 'mutton'] },
  { id: 'spicy', label: 'Prefer Spicy', keywords: ['spicy', 'hot', 'chili', 'pepper', 'curry'] },
  { id: 'mild', label: 'Prefer Mild', exclude: ['spicy', 'hot', 'chili'] },
];

export const CUISINE_MOODS = [
  { id: 'indian', label: 'Indian', icon: '🇮🇳' },
  { id: 'italian', label: 'Italian', icon: '🇮🇹' },
  { id: 'chinese', label: 'Chinese', icon: '🇨🇳' },
  { id: 'mexican', label: 'Mexican', icon: '🇲🇽' },
  { id: 'thai', label: 'Thai', icon: '🇹🇭' },
  { id: 'american', label: 'American', icon: '🇺🇸' },
  { id: 'mediterranean', label: 'Mediterranean', icon: '🥙' },
  { id: 'japanese', label: 'Japanese', icon: '🇯🇵' },
];

// Estimate cooking time from instructions (rough estimate)
export const estimateCookingTime = (instructions: string): number => {
  const text = instructions.toLowerCase();
  
  // Keywords that suggest longer cooking times
  const longCookingKeywords = ['marinate', 'simmer', 'roast', 'bake', 'slow cook', 'ferment'];
  const mediumCookingKeywords = ['cook', 'fry', 'grill', 'steam'];
  const shortCookingKeywords = ['mix', 'serve', 'garnish', 'toss'];
  
  // Count occurrences
  let longCount = longCookingKeywords.filter(k => text.includes(k)).length;
  let mediumCount = mediumCookingKeywords.filter(k => text.includes(k)).length;
  
  // Estimate based on length and keywords
  const wordCount = instructions.split(/\s+/).length;
  
  if (longCount > 2 || wordCount > 300) {
    return 60; // Long recipe
  } else if (mediumCount > 3 || wordCount > 150) {
    return 40; // Medium recipe
  } else if (wordCount < 50) {
    return 15; // Quick recipe
  }
  
  return 30; // Default medium
};

// Check if recipe matches mood
export const matchesMood = (recipe: { strMeal?: string; strCategory?: string; strArea?: string; strInstructions?: string }, moodId: string): boolean => {
  const mood = COOKING_MOODS.find(m => m.id === moodId);
  if (!mood) return false;
  
  const text = `${recipe.strMeal || ''} ${recipe.strCategory || ''} ${recipe.strArea || ''} ${recipe.strInstructions || ''}`.toLowerCase();
  
  return mood.keywords.some(keyword => text.includes(keyword));
};

// Check if recipe matches dietary preference
export const matchesDietaryPreference = (
  recipe: { strMeal?: string; strInstructions?: string; strCategory?: string },
  preferenceId: string
): boolean => {
  const preference = DIETARY_PREFERENCES.find(p => p.id === preferenceId);
  if (!preference) return true;
  
  const text = `${recipe.strMeal || ''} ${recipe.strInstructions || ''} ${recipe.strCategory || ''}`.toLowerCase();
  
  if (preference.exclude) {
    return !preference.exclude.some(word => text.includes(word));
  }
  
  if (preference.prefer) {
    return preference.prefer.some(word => text.includes(word));
  }
  
  if (preference.keywords) {
    return preference.keywords.some(word => text.includes(word));
  }
  
  return true;
};

