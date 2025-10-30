// TheMealDB API service
const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

export interface Meal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strIngredient1: string | null;
  strIngredient2: string | null;
  strIngredient3: string | null;
  strIngredient4: string | null;
  strIngredient5: string | null;
  strIngredient6: string | null;
  strIngredient7: string | null;
  strIngredient8: string | null;
  strIngredient9: string | null;
  strIngredient10: string | null;
  strIngredient11: string | null;
  strIngredient12: string | null;
  strIngredient13: string | null;
  strIngredient14: string | null;
  strIngredient15: string | null;
  strIngredient16: string | null;
  strIngredient17: string | null;
  strIngredient18: string | null;
  strIngredient19: string | null;
  strIngredient20: string | null;
  strMeasure1: string | null;
  strMeasure2: string | null;
  strMeasure3: string | null;
  strMeasure4: string | null;
  strMeasure5: string | null;
  strMeasure6: string | null;
  strMeasure7: string | null;
  strMeasure8: string | null;
  strMeasure9: string | null;
  strMeasure10: string | null;
  strMeasure11: string | null;
  strMeasure12: string | null;
  strMeasure13: string | null;
  strMeasure14: string | null;
  strMeasure15: string | null;
  strMeasure16: string | null;
  strMeasure17: string | null;
  strMeasure18: string | null;
  strMeasure19: string | null;
  strMeasure20: string | null;
  strSource: string | null;
  strImageSource: string | null;
  strCreativeCommonsConfirmed: string | null;
  dateModified: string | null;
}

export interface MealSearchResult {
  meals: Meal[] | null;
}

export interface MealDetailResult {
  meals: Meal[] | null;
}

// Extract ingredients from meal object
export const getIngredients = (meal: Meal): Array<{ ingredient: string; measure: string }> => {
  const ingredients: Array<{ ingredient: string; measure: string }> = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal] as string | null;
    const measure = meal[`strMeasure${i}` as keyof Meal] as string | null;
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || ''
      });
    }
  }
  
  return ingredients;
};

// Search recipes by ingredient
export const searchRecipesByIngredient = async (ingredient: string): Promise<Meal[]> => {
  try {
    // Try singular first
    let response = await fetch(`${API_BASE}/filter.php?i=${encodeURIComponent(ingredient)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    
    let data: MealSearchResult = await response.json();
    
    // If no results, try plural
    if (!data.meals || data.meals.length === 0) {
      const pluralIngredient = ingredient.endsWith('s') ? ingredient.slice(0, -1) : ingredient + 's';
      if (pluralIngredient !== ingredient) {
        response = await fetch(`${API_BASE}/filter.php?i=${encodeURIComponent(pluralIngredient)}`);
        if (response.ok) {
          data = await response.json();
        }
      }
    }
    
    // If still no results, try common variations
    if (!data.meals || data.meals.length === 0) {
      const variations: Record<string, string> = {
        'mushroom': 'mushrooms',
        'tomato': 'tomatoes',
        'potato': 'potatoes',
        'chicken': 'chicken breast',
        'fish': 'salmon',
      };
      
      const variation = variations[ingredient.toLowerCase()];
      if (variation) {
        response = await fetch(`${API_BASE}/filter.php?i=${encodeURIComponent(variation)}`);
        if (response.ok) {
          data = await response.json();
        }
      }
    }
    
    // Filter out beef recipes (banned in many Indian states)
    const filteredMeals = (data.meals || []).filter(meal => {
      const mealName = meal.strMeal?.toLowerCase() || '';
      const category = meal.strCategory?.toLowerCase() || '';
      const area = meal.strArea?.toLowerCase() || '';
      const tags = meal.strTags?.toLowerCase() || '';
      // Exclude recipes with "beef" in name, category, area, or tags
      return !mealName.includes('beef') && 
             !category.includes('beef') && 
             !area.includes('beef') && 
             !tags.includes('beef');
    });
    
    return filteredMeals;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

// Check if recipe contains beef ingredients
const containsBeef = (meal: Meal): boolean => {
  const mealName = meal.strMeal?.toLowerCase() || '';
  const category = meal.strCategory?.toLowerCase() || '';
  const area = meal.strArea?.toLowerCase() || '';
  const tags = meal.strTags?.toLowerCase() || '';
  const instructions = meal.strInstructions?.toLowerCase() || '';
  
  // Check if beef is mentioned in name, category, area, tags, or instructions
  if (mealName.includes('beef') || category.includes('beef') || 
      area.includes('beef') || tags.includes('beef') || instructions.includes('beef')) {
    return true;
  }
  
  // Check all ingredients (up to 20 ingredients)
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal] as string | null;
    if (ingredient && ingredient.toLowerCase().includes('beef')) {
      return true;
    }
  }
  
  return false;
};

// Get full recipe details by ID
export const getRecipeDetails = async (mealId: string): Promise<Meal | null> => {
  try {
    const response = await fetch(`${API_BASE}/lookup.php?i=${encodeURIComponent(mealId)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipe details');
    }
    
    const data: MealDetailResult = await response.json();
    if (data.meals && data.meals.length > 0) {
      const meal = data.meals[0];
      // Filter out beef recipes
      if (containsBeef(meal)) {
        return null; // Return null if it's a beef recipe
      }
      return meal;
    }
    return null;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

// Search recipes by category
export const searchRecipesByCategory = async (category: string): Promise<Meal[]> => {
  try {
    const response = await fetch(`${API_BASE}/filter.php?c=${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    
    const data: MealSearchResult = await response.json();
    // Filter out beef recipes
    const filteredMeals = (data.meals || []).filter(meal => {
      const mealName = meal.strMeal?.toLowerCase() || '';
      const category = meal.strCategory?.toLowerCase() || '';
      const area = meal.strArea?.toLowerCase() || '';
      const tags = meal.strTags?.toLowerCase() || '';
      return !mealName.includes('beef') && 
             !category.includes('beef') && 
             !area.includes('beef') && 
             !tags.includes('beef');
    });
    return filteredMeals;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

// List all categories
export const getAllCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE}/list.php?c=list`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    return data.meals?.map((cat: { strCategory: string }) => cat.strCategory) || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get random recipe
export const getRandomRecipe = async (): Promise<Meal | null> => {
  try {
    // Try up to 5 times to get a non-beef recipe
    for (let i = 0; i < 5; i++) {
      const response = await fetch(`${API_BASE}/random.php`);
      if (!response.ok) {
        throw new Error('Failed to fetch random recipe');
      }
      
      const data: MealDetailResult = await response.json();
      if (data.meals && data.meals.length > 0) {
        const meal = data.meals[0];
        // If it's not a beef recipe, return it
        if (!containsBeef(meal)) {
          return meal;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    throw error;
  }
};

// Search recipes by name
export const searchRecipesByName = async (name: string): Promise<Meal[]> => {
  try {
    const response = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(name)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    
    const data: MealDetailResult = await response.json();
    // Filter out beef recipes
    const filteredMeals = (data.meals || []).filter(meal => {
      const mealName = meal.strMeal?.toLowerCase() || '';
      const category = meal.strCategory?.toLowerCase() || '';
      const area = meal.strArea?.toLowerCase() || '';
      const tags = meal.strTags?.toLowerCase() || '';
      return !mealName.includes('beef') && 
             !category.includes('beef') && 
             !area.includes('beef') && 
             !tags.includes('beef');
    });
    return filteredMeals;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

// List all areas/cuisines
export const getAllAreas = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE}/list.php?a=list`);
    if (!response.ok) {
      throw new Error('Failed to fetch areas');
    }
    
    const data = await response.json();
    return data.meals?.map((area: { strArea: string }) => area.strArea) || [];
  } catch (error) {
    console.error('Error fetching areas:', error);
    throw error;
  }
};

// Get recipes from all categories (for "All" filter)
export const getAllRecipes = async (): Promise<Meal[]> => {
  try {
    const allRecipes: Meal[] = [];
    
    // Get all categories first
    const categories = await getAllCategories();
    
    // Fetch recipes from multiple popular categories in parallel
    const categoryPromises = categories.slice(0, 10).map(category => 
      searchRecipesByCategory(category).catch(() => [])
    );
    
    const results = await Promise.all(categoryPromises);
    results.forEach(categoryRecipes => {
      allRecipes.push(...categoryRecipes);
    });
    
    // Remove duplicates based on meal ID
    const uniqueRecipes = Array.from(
      new Map(allRecipes.map(meal => [meal.idMeal, meal])).values()
    );
    
    // Shuffle and limit to reasonable number
    return uniqueRecipes.sort(() => Math.random() - 0.5).slice(0, 50);
  } catch (error) {
    console.error('Error fetching all recipes:', error);
    throw error;
  }
};

// Search recipes by area/cuisine
export const searchRecipesByArea = async (area: string): Promise<Meal[]> => {
  try {
    const response = await fetch(`${API_BASE}/filter.php?a=${encodeURIComponent(area)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    
    const data: MealSearchResult = await response.json();
    // Filter out beef recipes
    const filteredMeals = (data.meals || []).filter(meal => {
      const mealName = meal.strMeal?.toLowerCase() || '';
      const category = meal.strCategory?.toLowerCase() || '';
      const area = meal.strArea?.toLowerCase() || '';
      const tags = meal.strTags?.toLowerCase() || '';
      return !mealName.includes('beef') && 
             !category.includes('beef') && 
             !area.includes('beef') && 
             !tags.includes('beef');
    });
    return filteredMeals;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};
