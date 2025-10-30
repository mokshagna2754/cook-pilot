import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, Utensils, MapPin, ExternalLink, X, ChefHat, ArrowLeft } from 'lucide-react';
import { getRecipeDetails, Meal, getIngredients } from '@/services/mealApi';
import { addToRecent } from '@/utils/storage';
import CookingMode from './CookingMode';

interface RecipeDetailsProps {
  mealId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ mealId, isOpen, onClose }) => {
  const [recipe, setRecipe] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCookingMode, setIsCookingMode] = useState(false);

  useEffect(() => {
    if (mealId && isOpen) {
      setLoading(true);
      setError(null);
      getRecipeDetails(mealId)
        .then((data) => {
          if (data) {
            // Double-check: filter out beef recipes even if they somehow got through
            const mealName = data.strMeal?.toLowerCase() || '';
            const category = data.strCategory?.toLowerCase() || '';
            if (mealName.includes('beef') || category.includes('beef')) {
              setError('This recipe is not available in your region.');
              setRecipe(null);
            } else {
              setRecipe(data);
              addToRecent({
                idMeal: data.idMeal,
                strMeal: data.strMeal,
                strMealThumb: data.strMealThumb,
                strCategory: data.strCategory,
                strArea: data.strArea
              });
            }
          } else {
            setError('Recipe not found or not available in your region.');
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to load recipe');
          setLoading(false);
        });
    }
  }, [mealId, isOpen]);

  if (!isOpen) return null;

  const ingredients = recipe ? getIngredients(recipe) : [];
  const instructions = recipe?.strInstructions?.split(/\r?\n/).filter(line => line.trim()) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {recipe && !loading && (
          <>
            <DialogHeader className="pb-4 border-b">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 flex items-center">
                  {/* Back Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full mr-4 hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Back"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-100" />
                  </Button>
                  <div className="flex-1">
                    <DialogTitle className="text-3xl mb-3 text-gray-800 dark:text-gray-100">{recipe.strMeal}</DialogTitle>
                    <DialogDescription className="flex items-center gap-4 text-base">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        {recipe.strCategory}
                      </Badge>
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4" />
                        {recipe.strArea}
                      </span>
                    </DialogDescription>
                  </div>
                </div>
    {/* Single close handled by Back button on the left and dialog dismiss; removed duplicate X */}
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Recipe Image */}
              <div className="relative h-80 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md">
                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Ingredients */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Utensils className="h-6 w-6 text-orange-500" />
                  Ingredients
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ingredients.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <strong className="text-gray-800 dark:text-gray-100">{item.ingredient}</strong>
                        {item.measure && (
                          <span className="text-gray-600 dark:text-gray-300 ml-2">- {item.measure}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Clock className="h-6 w-6 text-orange-500" />
                  Instructions
                </h3>
                <div className="space-y-4">
                  {instructions.length > 0 ? (
                    instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                        <p className="flex-1 text-gray-700 dark:text-gray-200 leading-relaxed pt-1">{instruction.trim()}</p>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{recipe.strInstructions}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {recipe.strTags && (
                <div className="pt-4 border-t">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.strTags.split(',').map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Start Cooking Button */}
              <div className="pt-4 border-t">
                <Button
                  onClick={() => setIsCookingMode(true)}
                  className="w-full h-14 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white mb-4"
                  size="lg"
                >
                  <ChefHat className="h-5 w-5 mr-2" />
                  Start Cooking Mode
                </Button>
              </div>

              {/* YouTube Link */}
              {recipe.strYoutube && (
                <div className="pt-4 border-t">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-12 text-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <a
                      href={recipe.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Watch on YouTube
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>

      {/* Cooking Mode */}
      {recipe && (
        <CookingMode
          recipe={recipe}
          isOpen={isCookingMode}
          onClose={() => setIsCookingMode(false)}
        />
      )}
    </Dialog>
  );
};

export default RecipeDetails;