import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Heart, Shield, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import { type Food, toggleFavorite, toggleSafeFood, isInFavorites, isInSafeFoods } from '../utils/foodDatabase';
import { getAllergenSettings, type AllergenSettings } from '../utils/allergenSettings';

interface FoodCardProps {
  food: Food;
  detailed?: boolean;
  onUpdate?: () => void;
}

export default function FoodCard({ food, detailed = false, onUpdate }: FoodCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSafe, setIsSafe] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [allergenSettings, setAllergenSettings] = useState<AllergenSettings>({});

  useEffect(() => {
    loadAllergenSettings();
    loadFoodStatus();
  }, []);

  const loadAllergenSettings = async () => {
    const settings = await getAllergenSettings();
    setAllergenSettings(settings);
  };

  const loadFoodStatus = async () => {
    const [favoriteStatus, safeStatus] = await Promise.all([
      isInFavorites(food.id),
      isInSafeFoods(food.id)
    ]);
    setIsFavorite(favoriteStatus);
    setIsSafe(safeStatus);
  };

  const handleToggleFavorite = async () => {
    const newState = await toggleFavorite(food);
    setIsFavorite(newState);
    onUpdate?.();
  };

  const handleToggleSafe = async () => {
    const newState = await toggleSafeFood(food);
    setIsSafe(newState);
    onUpdate?.();
  };

  const getAllergenCount = () => {
    return food.allergens.filter(a => a.present && allergenSettings[a.name]).length;
  };

  const getEnabledAllergens = () => {
    return food.allergens.filter(a => a.present && allergenSettings[a.name]);
  };

  const hasEnabledAllergens = getEnabledAllergens().length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.brandName}>{food.brand}</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, isFavorite && styles.activeHeart]} 
            onPress={handleToggleFavorite}
          >
            <Heart 
              size={20} 
              color={isFavorite ? "#ffffff" : "#6b7280"} 
              fill={isFavorite ? "#ffffff" : "transparent"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, isSafe && styles.activeShield]} 
            onPress={handleToggleSafe}
          >
            <Shield 
              size={20} 
              color={isSafe ? "#ffffff" : "#6b7280"} 
              fill={isSafe ? "#ffffff" : "transparent"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.allergenStatus, hasEnabledAllergens ? styles.warningStatus : styles.safeStatus]}>
        {hasEnabledAllergens ? (
          <>
            <AlertTriangle size={16} color="#EF4444" />
            <Text style={styles.warningText}>
              Contains {getAllergenCount()} monitored allergen{getAllergenCount() !== 1 ? 's' : ''}
            </Text>
          </>
        ) : (
          <>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.safeText}>No monitored allergens detected</Text>
          </>
        )}
      </View>

      {detailed && (
        <>
          <TouchableOpacity 
            style={styles.ingredientsToggle}
            onPress={() => setShowIngredients(!showIngredients)}
          >
            <Text style={styles.ingredientsToggleText}>Ingredients</Text>
            {showIngredients ? (
              <ChevronUp size={20} color="#6b7280" />
            ) : (
              <ChevronDown size={20} color="#6b7280" />
            )}
          </TouchableOpacity>

          {showIngredients && (
            <View style={styles.ingredientsSection}>
              <View style={styles.ingredientsList}>
                {food.ingredients.map((ingredient, index) => (
                  <Text key={index} style={styles.ingredient}>
                    • {ingredient}
                  </Text>
                ))}
              </View>
            </View>
          )}

        <View style={styles.allergenDetails}>
          <Text style={styles.allergenTitle}>Allergen Information:</Text>
          {food.allergens.map((allergen) => {
            const isEnabled = allergenSettings[allergen.name];
            const showWarning = allergen.present && isEnabled;
            
            return (
            <View 
              key={allergen.name} 
              style={[
                styles.allergenItem,
                showWarning ? styles.allergenPresent : 
                allergen.present ? styles.allergenDisabled : styles.allergenAbsent
              ]}
            >
              <View style={styles.allergenNameContainer}>
                <Text style={[
                  styles.allergenName,
                  showWarning ? styles.allergenPresentText : 
                  allergen.present ? styles.allergenDisabledText : styles.allergenAbsentText
                ]}>
                  {allergen.name}
                </Text>
                {allergen.present && !isEnabled && (
                  <Text style={styles.disabledLabel}>(monitoring disabled)</Text>
                )}
              </View>
              <Text style={[
                styles.allergenStatusText,
                showWarning ? styles.allergenPresentText : 
                allergen.present ? styles.allergenDisabledText : styles.allergenAbsentText
              ]}>
                {allergen.present ? 'Present' : 'Not detected'}
              </Text>
            </View>
            );
          })}
        </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  brandName: {
    fontSize: 14,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  activeHeart: {
    backgroundColor: '#EF4444',
  },
  activeShield: {
    backgroundColor: '#10B981',
  },
  allergenStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  warningStatus: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  safeStatus: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  warningText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  safeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  ingredientsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginTop: 16,
  },
  ingredientsToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  ingredientsSection: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  ingredientsList: {
    gap: 4,
  },
  ingredient: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  allergenDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  allergenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  allergenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  allergenPresent: {
    backgroundColor: '#FEF2F2',
  },
  allergenAbsent: {
    backgroundColor: '#F9FAFB',
  },
  allergenDisabled: {
    backgroundColor: '#FEF3C7',
  },
  allergenNameContainer: {
    flex: 1,
  },
  allergenName: {
    fontSize: 14,
    fontWeight: '500',
  },
  disabledLabel: {
    fontSize: 11,
    color: '#92400e',
    fontStyle: 'italic',
    marginTop: 2,
  },
  allergenPresentText: {
    color: '#EF4444',
  },
  allergenAbsentText: {
    color: '#6b7280',
  },
  allergenDisabledText: {
    color: '#92400e',
  },
  allergenStatusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});