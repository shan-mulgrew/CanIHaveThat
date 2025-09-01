import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchProductByBarcode, searchProductsByName, type OpenFoodFactsProduct } from './openFoodFactsApi';

export interface Allergen {
  name: string;
  present: boolean;
}

export interface Food {
  id: string;
  name: string;
  brand: string;
  barcode: string;
  ingredients: string[];
  allergens: Allergen[];
}

// Irish Top 7 Allergens mapping to Open Food Facts allergen tags
const IRISH_ALLERGEN_MAPPING: { [key: string]: string[] } = {
  'Cereals containing gluten': ['en:gluten', 'gluten'],
  'Crustaceans': ['en:crustaceans', 'crustaceans'],
  'Eggs': ['en:eggs', 'eggs'],
  'Fish': ['en:fish', 'fish'],
  'Peanuts': ['en:peanuts', 'peanuts'],
  'Soybeans': ['en:soybeans', 'soybeans', 'en:soy', 'soy'],
  'Milk': ['en:milk', 'milk', 'en:dairy', 'dairy'],
};

const FAVORITES_KEY = 'allergen_scanner_favorites';
const SAFE_FOODS_KEY = 'allergen_scanner_safe_foods';

const convertOpenFoodFactsToFood = (offProduct: OpenFoodFactsProduct): Food => {
  const product = offProduct.product;
  
  // Parse ingredients
  const ingredients: string[] = [];
  if (product.ingredients && Array.isArray(product.ingredients)) {
    ingredients.push(...product.ingredients.map(ing => ing.text));
  } else if (product.ingredients_text) {
    // Fallback to parsing ingredients text
    ingredients.push(...product.ingredients_text.split(',').map(ing => ing.trim()));
  }

  // Map allergens
  const allergens: Allergen[] = Object.keys(IRISH_ALLERGEN_MAPPING).map(allergenName => {
    const allergenTags = IRISH_ALLERGEN_MAPPING[allergenName];
    const isPresent = product.allergens_tags?.some(tag => 
      allergenTags.some(mappedTag => tag.includes(mappedTag))
    ) || false;

    return {
      name: allergenName,
      present: isPresent,
    };
  });

  return {
    id: offProduct.code,
    name: product.product_name || 'Unknown Product',
    brand: product.brands || 'Unknown Brand',
    barcode: offProduct.code,
    ingredients: ingredients.slice(0, 20), // Limit to first 20 ingredients
    allergens,
  };
};

export const getFoodByBarcode = async (barcode: string): Promise<Food | null> => {
  try {
    const offProduct = await searchProductByBarcode(barcode);
    if (offProduct) {
      return convertOpenFoodFactsToFood(offProduct);
    }
    return null;
  } catch (error) {
    console.error('Error fetching food by barcode:', error);
    return null;
  }
};

export const searchFoods = async (query: string): Promise<Food[]> => {
  try {
    const offProducts = await searchProductsByName(query);
    return offProducts.map(convertOpenFoodFactsToFood);
  } catch (error) {
    console.error('Error searching foods:', error);
    return [];
  }
};

export const getFavorites = async (): Promise<Food[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    if (favorites) {
      const favoriteData = JSON.parse(favorites);
      return favoriteData;
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
      const safeData = JSON.parse(safeFoods);
      return safeData;
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
    let favoriteData: Food[] = favorites ? JSON.parse(favorites) : [];
    
    const existingIndex = favoriteData.findIndex(f => f.id === food.id);
    
    if (existingIndex >= 0) {
      favoriteData.splice(existingIndex, 1);
    } else {
      favoriteData.push(food);
    }
    
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteData));
    return existingIndex < 0; // Return true if added, false if removed
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
};

export const toggleSafeFood = async (food: Food): Promise<boolean> => {
  try {
    const safeFoods = await AsyncStorage.getItem(SAFE_FOODS_KEY);
    let safeData: Food[] = safeFoods ? JSON.parse(safeFoods) : [];
    
    const existingIndex = safeData.findIndex(f => f.id === food.id);
    
    if (existingIndex >= 0) {
      safeData.splice(existingIndex, 1);
    } else {
      safeData.push(food);
    }
    
    await AsyncStorage.setItem(SAFE_FOODS_KEY, JSON.stringify(safeData));
    return existingIndex < 0; // Return true if added, false if removed
  } catch (error) {
    console.error('Error toggling safe food:', error);
    return false;
  }
};

export const isInFavorites = async (foodId: string): Promise<boolean> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    if (favorites) {
      const favoriteData: Food[] = JSON.parse(favorites);
      return favoriteData.some(f => f.id === foodId);
    }
    return false;
  } catch (error) {
    console.error('Error checking favorites:', error);
    return false;
  }
};

export const isInSafeFoods = async (foodId: string): Promise<boolean> => {
  try {
    const safeFoods = await AsyncStorage.getItem(SAFE_FOODS_KEY);
    if (safeFoods) {
      const safeData: Food[] = JSON.parse(safeFoods);
      return safeData.some(f => f.id === foodId);
    }
    return false;
  } catch (error) {
    console.error('Error checking safe foods:', error);
    return false;
  }
};