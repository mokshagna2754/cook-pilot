import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertCircle, ChefHat, Heart, Clock, Search, Sparkles, Sun, Moon } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetails from '@/components/RecipeDetails';
import FavoritesView from '@/components/FavoritesView';
import RecentView from '@/components/RecentView';
import { 
  searchRecipesByIngredient, 
  searchRecipesByName,
  searchRecipesByCategory,
  searchRecipesByArea,
  getAllRecipes,
  getRandomRecipe,
  getAllCategories,
  getAllAreas,
  Meal 
} from '@/services/mealApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useRef } from 'react';
import { POPULAR_INGREDIENTS, getIngredientSuggestions } from '@/utils/ingredients';
import { FAMOUS_DISHES_BY_CITY, getAllCities, getDishesByCity, getAllFamousDishes } from '@/utils/famousDishes';
import { getDishSearchTerms, getDishIngredients } from '@/utils/dishMappings';
// cookingPreferences imports not needed since Smart Filters are removed

const Index = () => {
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'search' | 'favorites' | 'recent'>('search');
  
  // Search states
  const [searchType, setSearchType] = useState<'ingredient' | 'dish' | 'all'>('ingredient');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [ingredientSuggestions, setIngredientSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Smart Filters removed

  // 1. Dark mode state/tracker at the top
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Read from local storage or prefers-color-scheme
    if (typeof window !== 'undefined') {
      const userPref = window.localStorage.getItem('color-scheme');
      if(userPref) return userPref === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      window.localStorage.setItem('color-scheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      window.localStorage.setItem('color-scheme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    getAllCategories().then(setCategories).catch(console.error);
    getAllAreas().then(setAreas).catch(console.error);
  }, []);

  const handleCitySearch = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      setActiveView('search');
      setSelectedCity(city);
      
      // Get all dishes for the selected city (or all cities if "All" is selected)
      const dishes = city === 'All' ? getAllFamousDishes() : getDishesByCity(city);
      
      if (dishes.length === 0) {
        setError(`No dishes found for ${city}`);
        setRecipes([]);
        setLoading(false);
        return;
      }
      
      let allResults: Meal[] = [];
      const uniqueMealIds = new Set<string>();
      
      // Search for all dishes in parallel (batch processing to avoid too many API calls)
      const batchSize = 5; // Process 5 dishes at a time
      for (let i = 0; i < dishes.length; i += batchSize) {
        const batch = dishes.slice(i, i + batchSize);
        const batchPromises = batch.map(async (dishName) => {
          let dishResults: Meal[] = [];
          
          // First, try searching by exact dish name
          dishResults = await searchRecipesByName(dishName);
          
          // If no results, try alternative search terms
          if (dishResults.length === 0) {
            const searchTerms = getDishSearchTerms(dishName);
            for (const term of searchTerms) {
              const altResults = await searchRecipesByName(term);
              if (altResults.length > 0) {
                dishResults = altResults;
                break;
              }
            }
          }
          
          // If still no results, try searching by primary ingredient
          if (dishResults.length === 0) {
            const ingredients = getDishIngredients(dishName);
            for (const ingredient of ingredients) {
              const ingredientResults = await searchRecipesByIngredient(ingredient);
              if (ingredientResults.length > 0) {
                dishResults = ingredientResults;
                break;
              }
            }
          }
          
          // Special handling for Biryani
          if (dishResults.length === 0 && dishName.toLowerCase().includes('biryani')) {
            const pilafResults = await searchRecipesByName('pilaf');
            if (pilafResults.length > 0) {
              dishResults = pilafResults;
            } else {
              const riceResults = await searchRecipesByIngredient('rice');
              if (riceResults.length > 0) {
                dishResults = riceResults.slice(0, 10);
              }
            }
          }
          
          return dishResults;
        });
        
        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach(results => {
          results.forEach(meal => {
            if (!uniqueMealIds.has(meal.idMeal)) {
              uniqueMealIds.add(meal.idMeal);
              allResults.push(meal);
            }
          });
        });
        
        // Limit to first 50 recipes to avoid overwhelming the UI
        if (allResults.length >= 50) break;
      }
      
      setRecipes(allResults.slice(0, 50));
      
      if (allResults.length === 0) {
        setError(`No recipes found for dishes from ${city}. TheMealDB has limited Indian dishes. Try searching by ingredient instead!`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = async () => {
    if (!searchQuery.trim() && searchType !== 'all') return;

      try {
        setLoading(true);
        setError(null);
      setActiveView('search');
      let results: Meal[] = [];

      switch (searchType) {
        case 'all':
          results = await getAllRecipes();
          break;
        case 'ingredient':
          results = await searchRecipesByIngredient(searchQuery.trim());
          break;
      }

      setRecipes(results);
      if (results.length === 0) {
        setError(`No recipes found for "${searchQuery}". Try adjusting your filters or use different search terms!`);
      }
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
      setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

  const handleRandomSearch = async () => {
      try {
        setLoading(true);
        setError(null);
      setActiveView('search');
      const randomRecipe = await getRandomRecipe();
      if (randomRecipe) {
        setRecipes([randomRecipe]);
        setSelectedRecipeId(randomRecipe.idMeal);
        setIsDetailsOpen(true);
      }
      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch random recipe');
      } finally {
        setLoading(false);
      }
    };

  const handleViewDetails = (mealId: string) => {
    setSelectedRecipeId(mealId);
    setIsDetailsOpen(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      handleSearch();
    }
  };

  const handleIngredientInputChange = (value: string) => {
    setSearchQuery(value);
    if (searchType === 'ingredient' && value.trim()) {
      const suggestions = getIngredientSuggestions(value);
      setIngredientSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (ingredient: string) => {
    setSearchQuery(ingredient);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSelectIngredientFromList = (ingredient: string) => {
    setSearchQuery(ingredient);
    setShowSuggestions(false);
    handleSearch();
  };

  // Quick-start: fetch All Recipes immediately without relying on state updates
  const handleQuickAll = async () => {
    try {
      setLoading(true);
      setError(null);
      setActiveView('search');
      const results = await getAllRecipes();
      setRecipes(results);
      if (results.length === 0) {
        setError('No recipes found. Try searching by ingredient!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Presets removed with Smart Filters

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-black text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12 relative">
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={() => (window.location.href = '/')}
              className="group inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow hover:shadow-md transition-colors"
              aria-label="Go to home"
            >
              <ChefHat className="h-7 w-7 drop-shadow" />
              <span className="text-3xl md:text-4xl font-extrabold tracking-tight group-hover:opacity-95">
                cook pilot
              </span>
            </button>
            {/* Dark Mode Toggle - floating top right */}
            <button
              aria-label="Toggle dark mode"
              className="absolute top-0 right-0 m-4 bg-white dark:bg-gray-900 shadow p-2 rounded-full transition-colors"
              onClick={() => setDarkMode(v => !v)}
            >
              {darkMode ? <Sun className="h-6 w-6 text-yellow-400" /> : <Moon className="h-6 w-6 text-blue-700" />}
            </button>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find delicious recipes based on your ingredients
          </p>
        </header>

        {/* Main Navigation */}
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as typeof activeView)} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            {/* Smart Filters removed */}

            {/* Regular Search Card */}
            <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search Type Selector */}
                  <Select value={searchType} onValueChange={(v) => {
                    setSearchType(v as typeof searchType);
                    setSelectedCity(''); // Reset city when switching search types
                    setRecipes([]); // Clear recipes
                    setError(null); // Clear errors
                  }}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Recipes</SelectItem>
                      <SelectItem value="ingredient">Search by Ingredient</SelectItem>
                      <SelectItem value="dish">Famous Dishes by City</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Search Input or Select */}
                  {searchType === 'all' ? (
                    <div className="flex-1 flex items-center justify-center text-gray-600 dark:text-gray-300">
                      <p className="text-sm">Showing recipes from all categories</p>
                    </div>
                  ) : searchType === 'dish' ? (
                    <div className="flex-1">
                      <Select 
                        value={selectedCity || ''} 
                        onValueChange={(city) => {
                          setSelectedCity(city);
                          handleCitySearch(city);
                        }}
                      >
                        <SelectTrigger className="w-full h-12">
                          <SelectValue placeholder="Select city to see all famous dishes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All Cities (All Famous Dishes)</SelectItem>
                          {getAllCities().map((city) => (
                            <SelectItem key={city} value={city}>{city} - Famous Dishes</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        placeholder="Enter ingredient (e.g., chicken, pasta, tomato...)"
                        value={searchQuery}
                        onChange={(e) => handleIngredientInputChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => {
                          if (searchType === 'ingredient' && searchQuery.trim()) {
                            const suggestions = getIngredientSuggestions(searchQuery);
                            setIngredientSuggestions(suggestions);
                            setShowSuggestions(suggestions.length > 0);
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowSuggestions(false), 200);
                        }}
                        className="h-12 text-lg"
                        disabled={loading}
                      />
                      {showSuggestions && ingredientSuggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                          {ingredientSuggestions.map((ingredient, index) => (
                            <button
                              key={index}
                              type="button"
                              onMouseDown={() => handleSelectSuggestion(ingredient)}
                              className="w-full text-left px-4 py-2 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              {ingredient}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Search Button */}
                  {searchType !== 'dish' && (
                    <Button
                      onClick={handleSearch}
                      disabled={(searchType !== 'all' && !searchQuery.trim()) || loading}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-12 px-8"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="h-5 w-5 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  )}
                  {searchType === 'dish' && selectedCity && (
                    <div className="text-sm text-gray-500 flex items-center justify-center">
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <span>Searching dishes from {selectedCity === 'All' ? 'all cities' : selectedCity}...</span>
                      )}
                    </div>
                  )}

                  {/* Random Button */}
                  <Button
                    onClick={handleRandomSearch}
                    disabled={loading}
                    variant="outline"
                    className="h-12 px-6 border-2"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Random
                  </Button>
                </div>
              </CardContent>
            </Card>

        {/* Error Alert */}
        {error && (
              <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
              <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-900/80">
                <CardContent className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto" />
                    <p className="text-gray-600 dark:text-gray-300">Searching for recipes...</p>
              </div>
            </CardContent>
          </Card>
        )}

            {/* Results */}
            {!loading && recipes.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-orange-500" />
                  Found {recipes.length} Recipe{recipes.length !== 1 ? 's' : ''}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map((meal) => (
                    <RecipeCard
                      key={meal.idMeal}
                      meal={meal}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
        )}

            {/* Empty State Quick Start Buttons */}
            {!loading && recipes.length === 0 && !error && (
              <div className="space-y-6">
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 font-semibold rounded-full shadow transition-colors"
                    onClick={handleQuickAll}
                  >
                    <Clock className="inline mr-2 w-5 h-5" />30 min or less
                  </button>
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 font-semibold rounded-full shadow"
                    onClick={handleQuickAll}
                  >🍲 Comforting</button>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 font-semibold rounded-full shadow"
                    onClick={handleQuickAll}
                  >🥗 Healthy</button>
                  <button
                    className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 font-semibold rounded-full shadow"
                    onClick={handleQuickAll}
                  >🇮🇳 Indian</button>
                  <button
                    className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 font-semibold rounded-full shadow"
                    onClick={handleQuickAll}
                  >🚫 Onion</button>
                  <button
                    className="bg-gradient-to-r from-yellow-400 to-pink-500 hover:brightness-110 text-white px-5 py-2 font-semibold rounded-full shadow-lg"
                    onClick={handleRandomSearch}
                  >
                    <Sparkles className="inline mr-2 w-5 h-5" />Surprise Me
                  </button>
                </div>
                <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-900/80">
                  <CardContent className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                    <ChefHat className="h-16 w-16 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Start Your Search</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      Enter an ingredient, recipe name, or browse by category to discover amazing recipes!
                </p>
              </CardContent>
            </Card>

                {/* Popular Ingredients */}
                {searchType === 'ingredient' && (
                  <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-900/80">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Popular Ingredients</h3>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_INGREDIENTS.slice(0, 50).map((ingredient, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectIngredientFromList(ingredient)}
                            className="hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
                          >
                            {ingredient}
                          </Button>
                        ))}
                  </div>
                      <p className="text-sm text-gray-500 mt-4">
                        Click any ingredient above to search for recipes, or scroll for more options
                </p>
              </CardContent>
            </Card>
                )}

                {/* Quick Start for Busy Professionals */}
                {/* Quick Start removed */}
          </div>
        )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <FavoritesView onViewDetails={handleViewDetails} />
          </TabsContent>

          {/* Recent Tab */}
          <TabsContent value="recent">
            <RecentView onViewDetails={handleViewDetails} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Recipe Details Modal */}
      <RecipeDetails
        mealId={selectedRecipeId}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default Index;