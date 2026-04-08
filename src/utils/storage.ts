// Local storage utilities for favorites and recent recipes

const FAVORITES_KEY = 'recipe-ideas-favorites';
const RECENT_KEY = 'recipe-ideas-recent';
const MAX_RECENT = 20;

export interface StoredRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
}

// Favorites
export const getFavorites = (): StoredRecipe[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addToFavorites = (recipe: StoredRecipe): void => {
  try {
    const favorites = getFavorites();
    if (!favorites.find(f => f.idMeal === recipe.idMeal)) {
      favorites.unshift(recipe);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

export const removeFromFavorites = (mealId: string): void => {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(f => f.idMeal !== mealId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};

export const isFavorite = (mealId: string): boolean => {
  try {
    const favorites = getFavorites();
    return favorites.some(f => f.idMeal === mealId);
  } catch {
    return false;
  }
};

// Recent recipes
export const getRecentRecipes = (): StoredRecipe[] => {
  try {
    const stored = localStorage.getItem(RECENT_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addToRecent = (recipe: StoredRecipe): void => {
  try {
    const recent = getRecentRecipes();
    // Remove if already exists
    const filtered = recent.filter(r => r.idMeal !== recipe.idMeal);
    // Add to beginning
    filtered.unshift(recipe);
    // Keep only MAX_RECENT
    const limited = filtered.slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error adding to recent:', error);
  }
};

export const clearRecent = (): void => {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch (error) {
    console.error('Error clearing recent:', error);
  }
};
