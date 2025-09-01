import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Allergen {
  name: string;
  present: boolean;
}

export interface Food {
  id: string;
  name: string;
  brand: string;
  barcode: string;
  allergens: Allergen[];
}

// Irish Top 7 Allergens
const IRISH_ALLERGENS = [
  'Cereals containing gluten',
  'Crustaceans',
  'Eggs',
  'Fish',
  'Peanuts',
  'Soybeans',
  'Milk',
];

// Mock food database
const MOCK_FOODS: Food[] = [
  {
    id: '1',
    name: 'Whole Wheat Bread',
    brand: 'Brennans',
    barcode: '5000169005057',
    allergens: [
      { name: 'Cereals containing gluten', present: true },
      { name: 'Crustaceans', present: false },
      { name: 'Eggs', present: false },
      { name: 'Fish', present: false },
      { name: 'Peanuts', present: false },
      { name: 'Soybeans', present: false },
      { name: 'Milk', present: false },
    ],
  },
  {
    id: '2',
    name: 'Fresh Salmon Fillet',
    brand: 'SuperValu',
    barcode: '5391531234567',
    allergens: [
      { name: 'Cereals containing gluten', present: false },
      { name: 'Crustaceans', present: false },
      { name: 'Eggs', present: false },
      { name: 'Fish', present: true },
      { name: 'Peanuts', present: false },
      { name: 'Soybeans', present: false },
      { name: 'Milk', present: false },
    ],
  },
  {
    id: '3',
    name: 'Natural Greek Yogurt',
    brand: 'Glenisk',
    barcode: '5391520654321',
    allergens: [
      { name: 'Cereals containing gluten', present: false },
      { name: 'Crustaceans', present: false },
      { name: 'Eggs', present: false },
      { name: 'Fish', present: false },
      { name: 'Peanuts', present: false },
      { name: 'Soybeans', present: false },
      { name: 'Milk', present: true },
    ],
  },
  {
    id: '4',
    name: 'Organic Free Range Eggs',
    brand: 'Dunnes Stores',
    barcode: '5391533987654',
    allergens: [
      { name: 'Cereals containing gluten', present: false },
      { name: 'Crustaceans', present: false },
      { name: 'Eggs', present: true },
      { name: 'Fish', present: false },
      { name: 'Peanuts', present: false },
      { name: 'Soybeans', present: false },
      { name: 'Milk', present: false },
    ],
  },
  {
    id: '5',
    name: 'Peanut Butter',
    brand: 'Whole Earth',
    barcode: '5000169123456',
    allergens: [
      { name: 'Cereals containing gluten', present: false },
      { name: 'Crustaceans', present: false },
      { name: 'Eggs', present: false },
      { name: 'Fish', present: false },
      { name: 'Peanuts', present: true },
      { name: 'Soybeans', present: false },
      { name: 'Milk', present: false },
    ],
  },
  {
    id: '6',
    name: 'Soy Milk',
    brand: 'Alpro',
    barcode: '5411188123789',
    allergens: [
      { name: 'Cereals containing gluten', present: false },
      { name: 'Crustaceans', present: false },
      { name: 'Eggs', present: false },
      { name: 'Fish', present: false },
      { name: 'Peanuts', present: false },
      { name: 'Soybeans', present: true },
      { name: 'Milk', present: false },
    ],
  },
  {
    id: '7',
    name: 'Fresh Prawns',
    brand: 'Tesco',
    barcode: '5000169999999',
    allergens: [
      { name: 'Cereals containing gluten', present: false },
      { name: 'Crustaceans', present: true },
      { name: 'Eggs', present: false },
      { name: 'Fish', present: false },
      { name: 'Peanuts', present: false },
      { name: 'Soybeans', present: false },
      { name: 'Milk', present: false },
    ],
  },
  {
    id: '8',
    name: 'Organic Bananas',
    brand: 'Fresh & Easy',
    barcode: '5391531111111',
    allergens: [
      { name: 'Cereals containing gluten', present: false },
      { name: 'Crustaceans', present: false },
      { name: 'Eggs', present: false },
      { name: 'Fish', present: false },
      { name: 'Peanuts', present: false },
      { name: 'Soybeans', present: false },
      { name: 'Milk', present: false },
    ],
  },
];

const FAVORITES_KEY = 'allergen_scanner_favorites';
const SAFE_FOODS_KEY = 'allergen_scanner_safe_foods';

export const getFoodByBarcode = async (barcode: string): Promise<Food | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const food = MOCK_FOODS.find(f => f.barcode === barcode);
  return food || null;
};

export const searchFoods = (query: string): Food[] => {
  const lowercaseQuery = query.toLowerCase();
  return MOCK_FOODS.filter(food => 
    food.name.toLowerCase().includes(lowercaseQuery) ||
    food.brand.toLowerCase().includes(lowercaseQuery)
  );
};

export const getFavorites = async (): Promise<Food[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    if (favorites) {
      const favoriteIds = JSON.parse(favorites);
      return MOCK_FOODS.filter(food => favoriteIds.includes(food.id));
    }
    return [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

export const getSafeFoods = async (): Promise<Food[]> => {
  try {
    const safeFoods = await AsyncStorage.getItem(SAFE_FOODS_KEY);
    if (safeFoods) {
      const safeIds = JSON.parse(safeFoods);
      return MOCK_FOODS.filter(food => safeIds.includes(food.id));
    }
    return [];
  } catch (error) {
    console.error('Error loading safe foods:', error);
    return [];
  }
};

export const toggleFavorite = async (food: Food): Promise<boolean> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    let favoriteIds = favorites ? JSON.parse(favorites) : [];
    
    const isCurrentlyFavorite = favoriteIds.includes(food.id);
    
    if (isCurrentlyFavorite) {
      favoriteIds = favoriteIds.filter((id: string) => id !== food.id);
    } else {
      favoriteIds.push(food.id);
    }
    
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
    return !isCurrentlyFavorite;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
};

export const toggleSafeFood = async (food: Food): Promise<boolean> => {
  try {
    const safeFoods = await AsyncStorage.getItem(SAFE_FOODS_KEY);
    let safeIds = safeFoods ? JSON.parse(safeFoods) : [];
    
    const isCurrentlySafe = safeIds.includes(food.id);
    
    if (isCurrentlySafe) {
      safeIds = safeIds.filter((id: string) => id !== food.id);
    } else {
      safeIds.push(food.id);
    }
    
    await AsyncStorage.setItem(SAFE_FOODS_KEY, JSON.stringify(safeIds));
    return !isCurrentlySafe;
  } catch (error) {
    console.error('Error toggling safe food:', error);
    return false;
  }
};

export const isInFavorites = (foodId: string): boolean => {
  // This is a synchronous check for initial state
  // In a real app, you'd want to manage this state more carefully
  return false;
};

export const isInSafeFoods = (foodId: string): boolean => {
  // This is a synchronous check for initial state
  // In a real app, you'd want to manage this state more carefully
  return false;
};