import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Heart } from 'lucide-react-native';
import { getFavorites, type Food } from '../../utils/foodDatabase';
import FoodCard from '../../components/FoodCard';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Food[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const refreshFavorites = () => {
    loadFavorites();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorite Foods</Text>
        <Text style={styles.subtitle}>
          {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {favorites.length > 0 ? (
          favorites.map((food) => (
            <FoodCard 
              key={food.id} 
              food={food} 
              onUpdate={refreshFavorites}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Heart size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>
              Scan or search for foods and tap the heart icon to add them to your favorites.
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