import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Heart, Shield, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react-native';
import { type Food, toggleFavorite, toggleSafeFood, isInFavorites, isInSafeFoods } from '@/utils/foodDatabase';

interface FoodCardProps {
  food: Food;
  detailed?: boolean;
  onUpdate?: () => void;
}

export default function FoodCard({ food, detailed = false, onUpdate }: FoodCardProps) {
  const [isFavorite, setIsFavorite] = useState(isInFavorites(food.id));
  const [isSafe, setIsSafe] = useState(isInSafeFoods(food.id));

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
    return food.allergens.filter(a => a.present).length;
  };

  const hasAllergens = getAllergenCount() > 0;

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

      <View style={[styles.allergenStatus, hasAllergens ? styles.warningStatus : styles.safeStatus]}>
        {hasAllergens ? (
          <>
            <AlertTriangle size={16} color="#EF4444" />
            <Text style={styles.warningText}>
              Contains {getAllergenCount()} allergen{getAllergenCount() !== 1 ? 's' : ''}
            </Text>
          </>
        ) : (
          <>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.safeText}>No allergens detected</Text>
          </>
        )}
      </View>

      {detailed && (
        <View style={styles.allergenDetails}>
          <Text style={styles.allergenTitle}>Irish Top 7 Allergens:</Text>
          {food.allergens.map((allergen) => (
            <View 
              key={allergen.name} 
              style={[
                styles.allergenItem,
                allergen.present ? styles.allergenPresent : styles.allergenAbsent
              ]}
            >
              <Text style={[
                styles.allergenName,
                allergen.present ? styles.allergenPresentText : styles.allergenAbsentText
              ]}>
                {allergen.name}
              </Text>
              <Text style={[
                styles.allergenStatus,
                allergen.present ? styles.allergenPresentText : styles.allergenAbsentText
              ]}>
                {allergen.present ? 'Present' : 'Not detected'}
              </Text>
            </View>
          ))}
        </View>
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
  allergenName: {
    fontSize: 14,
    fontWeight: '500',
  },
  allergenPresentText: {
    color: '#EF4444',
  },
  allergenAbsentText: {
    color: '#6b7280',
  },
});