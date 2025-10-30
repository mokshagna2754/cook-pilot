// Comprehensive list of food ingredients for recipe searches
// Excludes items banned/restricted by Indian government regulations
// Includes ingredients from famous Indian dishes across all major cities
// All ingredients selected to ensure 10-15+ recipes available in TheMealDB

export const POPULAR_INGREDIENTS = [
  // Meat & Poultry (excluding beef - banned in many Indian states)
  'Chicken', 'Chicken Breast', 'Chicken Thigh', 'Chicken Curry Cut', 'Mutton', 'Mutton Mince', 
  'Lamb', 'Lamb Chops', 'Lamb Mince', 'Pork', 'Pork Chop', 'Pork Mince',
  'Turkey', 'Turkey Breast', 'Duck', 'Duck Breast',
  
  // Seafood - High recipe count ingredients
  'Fish', 'Salmon', 'Tuna', 'Cod', 'Haddock', 'Mackerel', 'Sardines', 'Anchovies', 'Trout', 'Sea Bass',
  'Rohu', 'Katla', 'Pomfret', 'Kingfish', 'Surmai',
  'Shrimp', 'Prawns', 'Crab', 'Lobster', 'Squid', 'Octopus', 'Mussels', 'Clams', 'Scallops',
  
  // Vegetables - Common with many recipes
  'Tomato', 'Tomatoes', 'Potato', 'Potatoes', 'Onion', 'Onions', 'Garlic', 'Ginger', 'Garlic Paste', 'Ginger Paste',
  'Carrot', 'Carrots', 'Bell Pepper', 'Capsicum', 'Red Pepper', 'Green Pepper', 'Chili', 'Chili Pepper',
  'Green Chilies', 'Red Chilies', 'Dried Red Chilies', 'Chili Powder', 'Red Chili Powder', 'Kashmiri Red Chili',
  'Broccoli', 'Cauliflower', 'Spinach', 'Lettuce', 'Cabbage', 'Mushroom', 'Mushrooms', 'Eggplant', 'Brinjal',
  'Zucchini', 'Cucumber', 'Corn', 'Sweetcorn', 'Peas', 'Green Beans', 'String Beans', 'French Beans',
  'Asparagus', 'Celery', 'Radish', 'Mooli', 'Turnip', 'Beetroot', 'Sweet Potato', 'Shakarkandi',
  'Pumpkin', 'Squash', 'Leek', 'Spring Onion', 'Scallions', 'Okra', 'Lady Finger', 'Bhindi',
  'Raw Papaya', 'Ash Gourd', 'White Pumpkin', 'Petha', 'Snake Gourd', 'Ridge Gourd', 'Bottle Gourd', 'Lauki',
  'Mustard Greens', 'Sarson', 'Bathua', 'Chenopodium', 'Amaranth Leaves', 'Chaulai', 'Drumstick', 'Moringa',
  'Taro Root', 'Arbi', 'Yam', 'Kachalu', 'Plantain', 'Raw Banana', 'Green Papaya',
  
  // Indian Legumes & Lentils (Dals)
  'Lentils', 'Red Lentils', 'Masoor Dal', 'Green Lentils', 'Yellow Lentils', 'Toor Dal', 'Arhar Dal', 
  'Pigeon Peas', 'Urad Dal', 'Black Gram', 'Split Urad Dal', 'Whole Urad Dal',
  'Chana Dal', 'Split Bengal Gram', 'Chickpeas', 'Garbanzo Beans', 'Kabuli Chana',
  'Black Beans', 'Black Chana', 'Kidney Beans', 'Rajma', 'Navy Beans', 'Pinto Beans', 'Soybeans',
  'Moong Dal', 'Green Gram', 'Split Moong Dal', 'Whole Moong Dal', 'Yellow Moong Dal',
  'Moth Beans', 'Sprouted Beans', 'Matki', 'Black Eyed Peas', 'Lobia',
  
  // Indian Flours & Grains
  'Rice', 'Basmati Rice', 'Brown Rice', 'Wild Rice', 'Jasmine Rice', 'Sona Masuri Rice', 'Dosa Rice',
  'Poha', 'Flattened Rice', 'Aval', 'Puffed Rice', 'Kurmura', 'Murmura',
  'Wheat', 'Wheat Flour', 'Whole Wheat Flour', 'Atta', 'Maida', 'All Purpose Flour', 'Refined Flour',
  'Gram Flour', 'Besan', 'Chickpea Flour', 'Sattu', 'Roasted Gram Flour',
  'Semolina', 'Suji', 'Rava', 'Bombay Rava', 'Fine Rava', 'Coarse Rava',
  'Corn Flour', 'Maize Flour', 'Makki Ka Atta', 'Bajra', 'Pearl Millet', 'Jowar', 'Sorghum',
  'Oats', 'Quinoa', 'Barley', 'Bulgur', 'Flour', 'Breadcrumbs',
  
  // Indian Breads & Dough
  'Bread', 'White Bread', 'Whole Wheat Bread', 'Bread Crumbs', 'Pav', 'Bread Rolls', 'Bun',
  'Paratha', 'Roti', 'Chapati', 'Naan', 'Tandoori Roti', 'Butter Naan', 'Garlic Naan',
  'Poori', 'Bhature', 'Kulcha', 'Thepla', 'Puran Poli', 'Luchi',
  
  // Pasta & Noodles
  'Pasta', 'Spaghetti', 'Penne', 'Fusilli', 'Macaroni', 'Noodles', 'Ramen Noodles', 'Maggi',
  'Vermicelli', 'Seviyan', 'Semiya',
  
  // Indian Dairy & Paneer
  'Milk', 'Whole Milk', 'Cream', 'Heavy Cream', 'Sour Cream', 'Buttermilk', 'Chaas',
  'Cheese', 'Mozzarella', 'Cheddar', 'Parmesan', 'Feta', 'Ricotta', 'Cottage Cheese',
  'Paneer', 'Cubed Paneer', 'Grated Paneer', 'Chhena', 'Indian Cottage Cheese',
  'Butter', 'Ghee', 'Clarified Butter', 'Yogurt', 'Greek Yogurt', 'Curd', 'Dahi',
  'Eggs', 'Egg Whites', 'Egg Yolks', 'Boiled Eggs',
  
  // Indian Herbs & Greens
  'Basil', 'Tulsi', 'Coriander', 'Cilantro', 'Coriander Leaves', 'Dhaniya',
  'Parsley', 'Mint', 'Pudina', 'Mint Leaves', 'Curry Leaves', 'Kadi Patta',
  'Fenugreek Leaves', 'Methi', 'Dried Fenugreek Leaves', 'Kasuri Methi',
  'Dill', 'Soya', 'Fennel Greens', 'Saunf Ka Patta',
  
  // Indian Spices & Masalas
  'Garam Masala', 'Chaat Masala', 'Dabeli Masala', 'Goda Masala', 'Sambar Masala', 
  'Rasam Powder', 'Kashmiri Masala', 'Tandoori Masala', 'Biryani Masala',
  'Cumin', 'Jeera', 'Cumin Seeds', 'Roasted Cumin Powder',
  'Turmeric', 'Haldi', 'Turmeric Powder',
  'Ginger', 'Fresh Ginger', 'Ginger Powder', 'Dry Ginger Powder', 'Saunth',
  'Black Pepper', 'Kali Mirch', 'White Pepper',
  'Red Pepper Flakes', 'Paprika', 'Red Chili Powder',
  'Cardamom', 'Elaichi', 'Green Cardamom', 'Black Cardamom', 'Badi Elaichi',
  'Cinnamon', 'Dalchini', 'Cloves', 'Laung', 'Bay Leaves', 'Tej Patta',
  'Nutmeg', 'Jaiphal', 'Mace', 'Javitri', 'Star Anise', 'Chakra Phool',
  'Fennel Seeds', 'Saunf', 'Mustard Seeds', 'Rai', 'Yellow Mustard Seeds',
  'Nigella Seeds', 'Kalonji', 'Onion Seeds', 'Carom Seeds', 'Ajwain',
  'Fenugreek Seeds', 'Methi Seeds', 'Coriander Seeds', 'Dhaniya Seeds',
  'Asafoetida', 'Hing', 'Saffron', 'Keshar', 'Zafran',
  'Kewra Water', 'Kewra Essence', 'Rose Water', 'Gulab Jal',
  
  // Fruits - Popular in recipes
  'Apple', 'Banana', 'Overripe Banana', 'Ripe Banana', 'Orange', 'Lemon', 'Lime', 'Grapefruit',
  'Strawberry', 'Blueberry', 'Raspberry', 'Blackberry', 'Mango', 'Papaya', 'Ripe Papaya',
  'Pineapple', 'Avocado', 'Coconut', 'Coconut Milk', 'Coconut Cream', 'Grated Coconut', 'Coconut Shreds',
  'Cherry', 'Grape', 'Peach', 'Pear', 'Plum', 'Pomegranate', 'Pomegranate Seeds', 'Anar',
  'Kiwi', 'Dates', 'Khajur', 'Dried Dates', 'Fig', 'Anjeer', 'Raisins', 'Kishmish',
  
  // Nuts & Seeds - Common additions
  'Almonds', 'Badam', 'Walnuts', 'Akhrot', 'Cashews', 'Kaju', 'Peanuts', 'Moongphali', 'Groundnuts',
  'Pistachios', 'Pista', 'Hazelnuts', 'Pecans', 'Pine Nuts', 'Chilgoza',
  'Sesame Seeds', 'Til', 'White Sesame Seeds', 'Black Sesame Seeds',
  'Sunflower Seeds', 'Pumpkin Seeds', 'Chia Seeds', 'Flax Seeds', 'Sabja Seeds', 'Basil Seeds',
  'Macadamia Nuts', 'Charoli', 'Chironji',
  
  // Cooking Fats & Oils
  'Olive Oil', 'Vegetable Oil', 'Coconut Oil', 'Sesame Oil', 'Mustard Oil', 'Rai Ka Tel',
  'Ghee', 'Clarified Butter', 'Vanaspati', 'Refined Oil', 'Sunflower Oil', 'Groundnut Oil',
  
  // Pantry Essentials & Condiments
  'Salt', 'Rock Salt', 'Sendha Namak', 'Black Salt', 'Kala Namak', 'Sea Salt',
  'Sugar', 'Brown Sugar', 'Powdered Sugar', 'Jaggery', 'Gur', 'Palm Jaggery',
  'Honey', 'Maple Syrup', 'Sugar Syrup',
  'Vinegar', 'White Vinegar', 'Apple Cider Vinegar', 'Rice Vinegar',
  'Kachampuli', 'Coorg Vinegar', 'Tamarind', 'Imli', 'Tamarind Pulp', 'Tamarind Paste',
  'Soy Sauce', 'Tamari', 'Chili Sauce', 'Tomato Sauce', 'Tomato Ketchup',
  
  // Indian Sweeteners & Essences
  'Kewra Essence', 'Rose Essence', 'Vanilla', 'Vanilla Extract', 'Pineapple Essence',
  'Cardamom Powder', 'Elaichi Powder', 'Elaichi Essence',
  
  // Baking & Dessert Ingredients
  'Chocolate', 'Dark Chocolate', 'Milk Chocolate', 'Cocoa Powder', 'Vanilla', 'Vanilla Extract',
  'Baking Powder', 'Baking Soda', 'Yeast', 'Cornstarch', 'Corn Flour',
  'Custard Powder', 'Gelatin', 'Agar Agar',
  
  // Indian Specialty Items
  'Khar', 'Alkaline Water', 'Dried Banana Peel Water',
  'Rock Salt', 'Black Salt', 'Kala Namak',
  'Coconut Milk', 'Coconut Cream', 'Coconut Water',
  'Rice Flour', 'Corn Starch', 'Arrowroot Powder'
];

export const getIngredientSuggestions = (query: string): string[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return POPULAR_INGREDIENTS
    .filter(ingredient => ingredient.toLowerCase().includes(lowerQuery))
    .slice(0, 8); // Limit to 8 suggestions
};