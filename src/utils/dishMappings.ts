// Map Indian dish names to searchable terms and ingredients for TheMealDB
// Since TheMealDB has limited Indian dishes, we map to similar dishes or ingredients

export const DISH_TO_INGREDIENTS: Record<string, string[]> = {
  // Mumbai
  'Misal Pav': ['sprouted beans', 'onion', 'potato', 'pav bread'],
  'Vada Pav': ['potato', 'bread', 'chickpea flour'],
  'Pav Bhaji': ['potato', 'tomato', 'cauliflower', 'bread'],
  'Bhel Puri': ['puffed rice', 'onion', 'tomato'],
  'Dahi Puri': ['yogurt', 'chickpea', 'tamarind'],
  
  // Delhi
  'Chole Bhature': ['chickpeas', 'flour'],
  'Butter Chicken': ['chicken', 'tomato', 'butter'],
  'Rajma Chawal': ['kidney beans', 'rice'],
  'Aloo Tikki': ['potato'],
  'Samosa': ['potato', 'flour'],
  
  // Kolkata
  'Kathi Roll': ['chicken', 'egg', 'onion', 'flour'],
  'Rasgulla': ['cottage cheese', 'sugar'],
  'Biriyani': ['rice', 'chicken', 'mutton'],
  'Fish Curry': ['fish', 'coconut'],
  
  // Hyderabad
  'Hyderabadi Biryani': ['rice', 'chicken', 'mutton'],
  'Haleem': ['lentils', 'wheat', 'meat'],
  'Double Ka Meetha': ['bread', 'milk', 'sugar'],
  
  // Bangalore/Chennai
  'Masala Dosa': ['rice', 'lentils', 'potato'],
  'Idli': ['rice', 'lentils'],
  'Sambar': ['lentils', 'vegetables'],
  'Bisi Bele Bath': ['rice', 'lentils', 'vegetables'],
  
  // Jaipur
  'Dal Bati Churma': ['lentils', 'wheat flour', 'ghee'],
  'Gatte Ki Sabzi': ['chickpea flour', 'yogurt'],
  'Laal Maas': ['mutton', 'red chili'],
  
  // Amritsar
  'Amritsari Kulcha': ['flour', 'potato', 'onion'],
  'Makki Di Roti': ['corn flour'],
  'Sarson Da Saag': ['mustard greens', 'spinach'],
  
  // Lucknow
  'Tunday Kebab': ['mutton', 'ginger', 'garlic'],
  'Biryani': ['rice', 'chicken', 'mutton', 'basmati rice', 'spices'],
  'Chicken Biryani': ['rice', 'chicken', 'basmati rice', 'chicken breast'],
  'Mutton Biryani': ['rice', 'mutton', 'lamb', 'basmati rice'],
  'Vegetable Biryani': ['rice', 'vegetables', 'basmati rice'],
  'Nihari': ['mutton', 'wheat'],
  
  // Goa
  'Prawn Curry': ['prawn', 'coconut'],
  'Chicken Xacuti': ['chicken', 'coconut'],
  
  // Gujarat
  'Dhokla': ['chickpea flour', 'yogurt'],
  'Thepla': ['wheat flour', 'fenugreek'],
  'Undhiyu': ['vegetables', 'coconut'],
  
  // Others
  'Paneer Tikka': ['cottage cheese', 'yogurt'],
  'Chicken Tikka': ['chicken', 'yogurt'],
  'Dal Makhani': ['black lentils', 'kidney beans', 'butter'],
};

// Get alternative search terms for a dish
export const getDishSearchTerms = (dishName: string): string[] => {
  const variations: Record<string, string[]> = {
    'Misal Pav': ['pav bhaji', 'chaat', 'sprouted beans'],
    'Vada Pav': ['potato', 'chickpea flour'],
    'Biryani': ['pilaf', 'rice', 'chicken', 'mutton', 'lamb', 'spiced rice'],
    'Hyderabadi Biryani': ['pilaf', 'rice', 'chicken', 'mutton', 'lamb'],
    'Chicken Biryani': ['pilaf', 'rice', 'chicken', 'spiced rice'],
    'Mutton Biryani': ['pilaf', 'rice', 'mutton', 'lamb', 'spiced rice'],
    'Vegetable Biryani': ['pilaf', 'rice', 'vegetable rice'],
    'Chole Bhature': ['chickpeas', 'chana masala', 'chickpeas'],
    'Idli': ['rice cake', 'steamed cake', 'rice'],
    'Dosa': ['crepe', 'pancake', 'rice crepe'],
    'Masala Dosa': ['crepe', 'pancake', 'potato crepe'],
    'Sambar': ['lentil soup', 'dal', 'lentils'],
    'Rajma Chawal': ['kidney beans', 'rajma', 'kidney beans rice'],
    'Kathi Roll': ['wrap', 'chicken wrap', 'chicken'],
    'Fish Curry': ['fish curry', 'seafood curry', 'fish'],
    'Prawn Curry': ['prawn curry', 'shrimp curry', 'prawn', 'shrimp'],
    'Pav Bhaji': ['vegetable curry', 'bhaji', 'potato'],
    'Butter Chicken': ['butter chicken', 'chicken curry', 'murgh makhani', 'chicken'],
    'Chicken Curry': ['chicken curry', 'chicken', 'curry'],
    'Mutton Curry': ['mutton curry', 'lamb curry', 'mutton', 'lamb'],
    'Dal Makhani': ['dal', 'lentils', 'black lentils'],
    'Paneer Tikka': ['cottage cheese', 'paneer', 'cheese'],
    'Tandoori Chicken': ['tandoori chicken', 'chicken', 'grilled chicken'],
    'Samosa': ['samosa', 'potato', 'fried pastry'],
  };
  
  return variations[dishName] || [dishName.toLowerCase()];
};

// Get ingredients for a dish to search with
export const getDishIngredients = (dishName: string): string[] => {
  return DISH_TO_INGREDIENTS[dishName] || [dishName.toLowerCase().split(' ')[0]];
};

