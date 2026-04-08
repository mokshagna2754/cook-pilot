import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Trash2 } from 'lucide-react';
import { getFavorites, removeFromFavorites, type StoredRecipe } from '@/utils/storage';
import { Meal } from '@/services/mealApi';
import { getRecipeDetails } from '@/services/mealApi';
import RecipeCard from '@/components/RecipeCard';

interface FavoritesViewProps {
  onViewDetails: (mealId: string) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ onViewDetails }) => {
  const [favorites, setFavorites] = useState<StoredRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [fullRecipes, setFullRecipes] = useState<Meal[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favs = getFavorites();
    setFavorites(favs);
    
    if (favs.length > 0) {
      setLoading(true);
      Promise.all(favs.map(fav => getRecipeDetails(fav.idMeal)))
        .then(results => {
          setFullRecipes(results.filter((r): r is Meal => r !== null));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  const handleRemove = (mealId: string) => {
    removeFromFavorites(mealId);
    loadFavorites();
  };

  if (favorites.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-900/80">
        <CardContent className="flex flex-col items-center justify-center h-96 text-center space-y-4">
          <Heart className="h-20 w-20 text-gray-300 dark:text-gray-500" />
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">No Favorites Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Start exploring recipes and click the heart icon to save your favorites!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Heart className="h-7 w-7 text-red-500 fill-red-500" />
          My Favorites ({favorites.length})
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <Card key={fav.idMeal} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse">
              <div className="h-56 bg-gray-200" />
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fullRecipes.map((meal) => (
            <div key={meal.idMeal} className="relative">
              <RecipeCard meal={meal} onViewDetails={onViewDetails} />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 left-2 h-9 w-9 rounded-full bg-red-500 hover:bg-red-600 text-white z-10 shadow-md"
                onClick={() => handleRemove(meal.idMeal)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesView;