import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Shield } from 'lucide-react-native';
import { getSafeFoods, type Food } from '@/utils/foodDatabase';
import FoodCard from '@/components/FoodCard';

export default function SafeFoodsScreen() {
  const [safeFoods, setSafeFoods] = useState<Food[]>([]);

  useEffect(() => {
    loadSafeFoods();
  }, []);

  const loadSafeFoods = async () => {
    const foods = await getSafeFoods();
    setSafeFoods(foods);
  };

  const refreshSafeFoods = () => {
    loadSafeFoods();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Safe Foods</Text>
        <Text style={styles.subtitle}>
          {safeFoods.length} safe food{safeFoods.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {safeFoods.length > 0 ? (
          safeFoods.map((food) => (
            <FoodCard 
              key={food.id} 
              food={food} 
              onUpdate={refreshSafeFoods}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Shield size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No safe foods yet</Text>
            <Text style={styles.emptyText}>
              Scan or search for foods and tap the shield icon to mark them as safe for you.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 40,
  },
});