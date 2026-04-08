import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Eye, Heart } from 'lucide-react';
import { Meal } from '@/services/mealApi';
import { isFavorite, addToFavorites, removeFromFavorites, type StoredRecipe } from '@/utils/storage';
import { useState, useEffect } from 'react';

interface RecipeCardProps {
  meal: Meal;
  onViewDetails: (mealId: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ meal, onViewDetails }) => {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(meal.idMeal));
  }, [meal.idMeal]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const storedRecipe: StoredRecipe = {
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
      strCategory: meal.strCategory,
      strArea: meal.strArea
    };

    if (favorited) {
      removeFromFavorites(meal.idMeal);
      setFavorited(false);
    } else {
      addToFavorites(storedRecipe);
      setFavorited(true);
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <Badge className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-900 shadow-md">
          {meal.strCategory}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 left-3 h-10 w-10 rounded-full shadow-md ${
            favorited
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-white/90 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200'
          }`}
          onClick={handleToggleFavorite}
        >
          <Heart className={`h-5 w-5 ${favorited ? 'fill-current' : ''}`} />
        </Button>
      </div>
      
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-orange-600 transition-colors h-14">
          {meal.strMeal}
        </CardTitle>
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-2">
          <MapPin className="h-4 w-4" />
          {meal.strArea}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-4">
        <Button
          onClick={() => onViewDetails(meal.idMeal)}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md"
          variant="default"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Recipe
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;