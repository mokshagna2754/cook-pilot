import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  Clock, 
  Heart, 
  ChefHat, 
  Filter, 
  X, 
  Plus,
  Loader2,
  Wand2,
  Timer,
  UtensilsCrossed
} from 'lucide-react';
import { COOKING_MOODS, COOKING_TIMES, DIETARY_PREFERENCES, CUISINE_MOODS } from '@/utils/cookingPreferences';

interface SmartSearchProps {
  onSearch: (filters: SmartFilters) => void;
  loading?: boolean;
}

export interface SmartFilters {
  ingredients: string[];
  mood?: string;
  timeAvailable?: string;
  dietaryPreferences: string[];
  cuisinePreferences: string[];
  excludeIngredients: string[];
}

const SmartSearch: React.FC<SmartSearchProps> = ({ onSearch, loading = false }) => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [excludeIngredients, setExcludeIngredients] = useState<string[]>([]);
  const [excludeInput, setExcludeInput] = useState('');

  const handleAddIngredient = () => {
    if (ingredientInput.trim() && !ingredients.includes(ingredientInput.trim())) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (ing: string) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const handleAddExcludeIngredient = () => {
    if (excludeInput.trim() && !excludeIngredients.includes(excludeInput.trim())) {
      setExcludeIngredients([...excludeIngredients, excludeInput.trim()]);
      setExcludeInput('');
    }
  };

  const handleRemoveExcludeIngredient = (ing: string) => {
    setExcludeIngredients(excludeIngredients.filter(i => i !== ing));
  };

  const handleToggleDietary = (prefId: string) => {
    setSelectedDietary(prev =>
      prev.includes(prefId) ? prev.filter(p => p !== prefId) : [...prev, prefId]
    );
  };

  const handleToggleCuisine = (cuisineId: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisineId) ? prev.filter(c => c !== cuisineId) : [...prev, cuisineId]
    );
  };

  const handleSearch = () => {
    onSearch({
      ingredients,
      mood: selectedMood || undefined,
      timeAvailable: selectedTime || undefined,
      dietaryPreferences: selectedDietary,
      cuisinePreferences: selectedCuisines,
      excludeIngredients,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'include' | 'exclude') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'include') {
        handleAddIngredient();
      } else {
        handleAddExcludeIngredient();
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 backdrop-blur-sm overflow-hidden relative w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-red-100/20 pointer-events-none" />
        <CardHeader className="relative z-10 pb-4 pt-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
              <Wand2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Smart Search
              </CardTitle>
              <CardDescription className="text-base mt-1 text-gray-600">
                Tell us what you have, how you feel, and what you want
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-6 pb-6">
          {/* Ingredients Section */}
          <div className="space-y-3 p-5 bg-white/70 rounded-xl border border-orange-100 shadow-sm">
            <label className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <ChefHat className="h-4 w-4 text-green-600" />
              </div>
              Ingredients You Have
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'include')}
                placeholder="Type ingredient and press Enter (e.g., chicken, tomato...)"
                className="flex-1 h-11 text-base border-2 border-gray-200 focus:border-orange-400 rounded-lg"
              />
              <Button 
                onClick={handleAddIngredient} 
                className="bg-green-500 hover:bg-green-600 text-white h-11 px-6"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {ingredients.map((ing) => (
                  <Badge 
                    key={ing} 
                    variant="secondary" 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                  >
                    {ing}
                    <button
                      onClick={() => handleRemoveIngredient(ing)}
                      className="ml-2 hover:scale-110 transition-transform font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Mood & Time Row */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Mood Section */}
            <div className="space-y-3 p-5 bg-white/70 rounded-xl border border-pink-100 shadow-sm">
              <label className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <div className="p-1.5 bg-pink-100 rounded-lg">
                  <Heart className="h-4 w-4 text-pink-600" />
                </div>
                What's Your Mood?
              </label>
              <Select value={selectedMood} onValueChange={setSelectedMood}>
                <SelectTrigger className="h-11 border-2 focus:border-pink-400">
                  <SelectValue placeholder="How are you feeling?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None - Show All</SelectItem>
                  {COOKING_MOODS.map((mood) => (
                    <SelectItem key={mood.id} value={mood.id} className="text-base">
                      <span className="text-xl mr-2">{mood.icon}</span>
                      {mood.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Available */}
            <div className="space-y-3 p-5 bg-white/70 rounded-xl border border-blue-100 shadow-sm">
              <label className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Timer className="h-4 w-4 text-blue-600" />
                </div>
                Time Available
              </label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="h-11 border-2 focus:border-blue-400">
                  <SelectValue placeholder="How much time do you have?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Time</SelectItem>
                  {COOKING_TIMES.map((time) => (
                    <SelectItem key={time.id} value={time.id} className="text-base">
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-3 p-5 bg-white/70 rounded-xl border border-purple-100 shadow-sm">
            <label className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <Filter className="h-4 w-4 text-purple-600" />
              </div>
              Dietary Preferences
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {DIETARY_PREFERENCES.map((pref) => (
                <div 
                  key={pref.id} 
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedDietary.includes(pref.id)
                      ? 'bg-purple-50 border-purple-400 shadow-md'
                      : 'bg-white border-gray-200 hover:border-purple-200'
                  }`}
                  onClick={() => handleToggleDietary(pref.id)}
                >
                  <Checkbox
                    id={pref.id}
                    checked={selectedDietary.includes(pref.id)}
                    onCheckedChange={() => handleToggleDietary(pref.id)}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <label
                    htmlFor={pref.id}
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    {pref.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Cuisine Preferences */}
          <div className="space-y-3 p-5 bg-white/70 rounded-xl border border-indigo-100 shadow-sm">
            <label className="text-base font-semibold text-gray-800 mb-3">
              Preferred Cuisines
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {CUISINE_MOODS.map((cuisine) => (
                <div
                  key={cuisine.id}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCuisines.includes(cuisine.id)
                      ? 'bg-indigo-50 border-indigo-400 shadow-md'
                      : 'bg-white border-gray-200 hover:border-indigo-200'
                  }`}
                  onClick={() => handleToggleCuisine(cuisine.id)}
                >
                  <Checkbox
                    id={cuisine.id}
                    checked={selectedCuisines.includes(cuisine.id)}
                    onCheckedChange={() => handleToggleCuisine(cuisine.id)}
                    className="data-[state=checked]:bg-indigo-600"
                  />
                  <label
                    htmlFor={cuisine.id}
                    className="text-sm font-medium cursor-pointer flex-1 flex items-center gap-1"
                  >
                    <span className="text-lg">{cuisine.icon}</span>
                    {cuisine.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Exclude Ingredients */}
          <div className="space-y-3 p-5 bg-white/70 rounded-xl border border-red-100 shadow-sm">
            <label className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <UtensilsCrossed className="h-4 w-4 text-red-600" />
              </div>
              Exclude Ingredients (Don't Want)
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={excludeInput}
                onChange={(e) => setExcludeInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'exclude')}
                placeholder="Ingredients to exclude (e.g., mushrooms, cilantro...)"
                className="flex-1 h-11 text-base border-2 border-gray-200 focus:border-red-400 rounded-lg"
              />
              <Button 
                onClick={handleAddExcludeIngredient} 
                className="bg-red-500 hover:bg-red-600 text-white h-11 px-6"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {excludeIngredients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {excludeIngredients.map((ing) => (
                  <Badge 
                    key={ing} 
                    variant="secondary" 
                    className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-3 py-1.5 text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                  >
                    {ing}
                    <button
                      onClick={() => handleRemoveExcludeIngredient(ing)}
                      className="ml-2 hover:scale-110 transition-transform font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={loading || ingredients.length === 0}
            className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white h-14 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Finding Perfect Recipes...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Find My Perfect Recipe
              </>
            )}
          </Button>
          {ingredients.length === 0 && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Add at least one ingredient to search
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartSearch;
