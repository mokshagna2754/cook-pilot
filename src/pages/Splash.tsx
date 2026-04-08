import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

const Splash: React.FC = () => {
  const nav = useNavigate();
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    // Play intro animation for 1.8s, then animate out for 400ms, then navigate
    const t1 = setTimeout(() => setAnimateOut(true), 1800);
    const t2 = setTimeout(() => nav('/home', { replace: true }), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [nav]);

  return (
    <div className={`min-h-screen flex items-center justify-center transition-opacity duration-500 ${animateOut ? 'opacity-0' : 'opacity-100'} bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:to-black`}>
      <div className="max-w-3xl mx-auto text-center p-8">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="p-4 rounded-full bg-white/80 dark:bg-gray-800 shadow-lg transform transition-transform duration-800 animate-pulse">
            <ChefHat className="h-12 w-12 text-orange-500" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-extrabold">CookPilot</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Your guided kitchen companion</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="inline-block bg-white/90 dark:bg-gray-900 rounded-full px-6 py-3 shadow-lg transform transition-all duration-700">
            <div className="text-sm text-gray-700 dark:text-gray-200">Turning ingredients into great meals…</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
