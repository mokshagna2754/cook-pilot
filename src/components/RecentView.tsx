import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { getRecentRecipes, clearRecent, type StoredRecipe } from '@/utils/storage';
import { Meal } from '@/services/mealApi';
import { getRecipeDetails } from '@/services/mealApi';
import RecipeCard from '@/components/RecipeCard';

interface RecentViewProps {
  onViewDetails: (mealId: string) => void;
}

const RecentView: React.FC<RecentViewProps> = ({ onViewDetails }) => {
  const [recent, setRecent] = useState<StoredRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [fullRecipes, setFullRecipes] = useState<Meal[]>([]);

  useEffect(() => {
    loadRecent();
  }, []);

  const loadRecent = () => {
    const rec = getRecentRecipes();
    setRecent(rec);
    
    if (rec.length > 0) {
      setLoading(true);
      Promise.all(rec.map(r => getRecipeDetails(r.idMeal)))
        .then(results => {
          setFullRecipes(results.filter((r): r is Meal => r !== null));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  const handleClear = () => {
    clearRecent();
    setRecent([]);
    setFullRecipes([]);
  };

  if (recent.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/90">
        <CardContent className="flex flex-col items-center justify-center h-96 text-center space-y-4">
          <Clock className="h-20 w-20 text-gray-300" />
          <h3 className="text-2xl font-semibold text-gray-700">No Recent Recipes</h3>
          <p className="text-gray-500 max-w-md">
            View some recipes and they'll appear here for quick access!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="h-7 w-7 text-orange-500" />
          Recently Viewed ({recent.length})
        </h2>
        <Button variant="outline" onClick={handleClear} size="sm" className="border-2">
          Clear History
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((rec) => (
            <Card key={rec.idMeal} className="border border-gray-200 bg-white animate-pulse">
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
            <RecipeCard key={meal.idMeal} meal={meal} onViewDetails={onViewDetails} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentView;