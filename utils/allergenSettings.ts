import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AllergenSettings {
  [allergenName: string]: boolean;
}

const ALLERGEN_SETTINGS_KEY = 'allergen_scanner_settings';

// Default settings - all allergens enabled by default
const DEFAULT_SETTINGS: AllergenSettings = {
  'Cereals containing gluten': true,
  'Crustaceans': true,
  'Eggs': true,
  'Fish': true,
  'Peanuts': true,
  'Soybeans': true,
  'Milk': true,
};

export const getAllergenSettings = async (): Promise<AllergenSettings> => {
  try {
    const settings = await AsyncStorage.getItem(ALLERGEN_SETTINGS_KEY);
    if (settings) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(settings) };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading allergen settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const updateAllergenSettings = async (settings: AllergenSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(ALLERGEN_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving allergen settings:', error);
  }
};

export const isAllergenEnabled = async (allergenName: string): Promise<boolean> => {
  const settings = await getAllergenSettings();
  return settings[allergenName] ?? true;
};