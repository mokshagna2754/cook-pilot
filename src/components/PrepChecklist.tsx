import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, CheckCircle2 } from 'lucide-react';
import { PrepIngredient, scaleMeasure } from '@/utils/cookingSteps';

interface PrepChecklistProps {
  ingredients: PrepIngredient[];
  scaleFactor: number;
  onComplete: () => void;
}

const PrepChecklist: React.FC<PrepChecklistProps> = ({
  ingredients,
  scaleFactor,
  onComplete,
}) => {
  const [prepared, setPrepared] = useState<Record<string, boolean>>({});

  const handleToggle = (name: string) => {
    setPrepared((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const allPrepared = ingredients.every((ing) => prepared[ing.name]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Utensils className="h-6 w-6 text-orange-500" />
            Prepare All Ingredients First
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Check off each ingredient as you prepare it. This ensures smooth cooking!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ingredients.map((ingredient) => {
              const isPrepared = prepared[ingredient.name];
              const scaledMeasure = scaleFactor !== 1 ? scaleMeasure(ingredient.measure, scaleFactor) : ingredient.measure;
              
              return (
                <div
                  key={ingredient.name}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                    isPrepared
                      ? 'bg-green-50 border-green-300'
                      : 'bg-white border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <Checkbox
                    checked={isPrepared}
                    onCheckedChange={() => handleToggle(ingredient.name)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-gray-800">{ingredient.name}</strong>
                      {isPrepared && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {scaledMeasure && (
                      <span className="text-sm text-gray-600 ml-1">
                        {scaledMeasure}
                        {scaleFactor !== 1 && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {scaleFactor}x
                          </Badge>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={onComplete}
              disabled={!allPrepared}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-12 text-lg"
              size="lg"
            >
              {allPrepared ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  All Ingredients Ready - Start Cooking!
                </>
              ) : (
                `Prepare ${ingredients.filter((i) => !prepared[i.name]).length} more ingredient(s)`
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrepChecklist;

