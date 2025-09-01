import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Search, Camera as CameraIcon, X } from 'lucide-react-native';
import { getFoodByBarcode, searchFoods, type Food } from '../../utils/foodDatabase';
import FoodCard from '../../components/FoodCard';

export default function ScannerScreen() {
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [scannedFood, setScannedFood] = useState<Food | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    try {
      const food = await getFoodByBarcode(data);
      if (food) {
        setScannedFood(food);
        setShowCamera(false);
      } else {
        setScanned(false);
        Alert.alert(
          'Food Not Found',
          'This barcode is not in our database. Try searching manually.'
        );
      }
    } catch (error) {
      setScanned(false);
      Alert.alert(
        'Food Not Found',
        'This barcode is not in our database. Try searching manually.'
      );
    }
  };

  const startScanning = () => {
    if (!hasPermission?.granted) {
      requestPermission();
      return;
    }
    setShowCamera(true);
    setScanned(false);
    setScannedFood(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = searchFoods(query);
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setShowSearch(false);
      setSearchResults([]);
    }
  };

  const selectFood = (food: Food) => {
    setScannedFood(food);
    setShowSearch(false);
    setSearchQuery('');
  };

  if (showCamera) {
    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.topOverlay} />
            <View style={styles.middleRow}>
              <View style={styles.sideOverlay} />
              <View style={styles.scanArea}>
                <View style={styles.scanFrame} />
              </View>
              <View style={styles.sideOverlay} />
            </View>
            <View style={styles.bottomOverlay}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowCamera(false)}
              >
                <X size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
        <Text style={styles.scanInstruction}>
          Point your camera at a barcode to scan
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Allergen Scanner</Text>
        <Text style={styles.subtitle}>Scan or search for food items</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for food items..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        
        <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
          <CameraIcon size={20} color="#ffffff" />
          <Text style={styles.scanButtonText}>Scan Barcode</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {showSearch && searchResults.length > 0 && (
          <View style={styles.searchResults}>
            <Text style={styles.resultsTitle}>Search Results</Text>
            {searchResults.map((food) => (
              <TouchableOpacity key={food.id} onPress={() => selectFood(food)}>
                <FoodCard food={food} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {scannedFood && (
          <View style={styles.scannedFood}>
            <Text style={styles.resultsTitle}>Scanned Food</Text>
            <FoodCard food={scannedFood} detailed />
          </View>
        )}

        {!showSearch && !scannedFood && (
          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>How to use:</Text>
            <Text style={styles.instructionText}>
              • Tap "Scan Barcode" to scan food items{'\n'}
              • Use the search bar to find foods manually{'\n'}
              • View allergen information for Irish top 7 allergens{'\n'}
              • Save foods as favorites or mark as safe
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    gap: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchResults: {
    marginTop: 20,
  },
  scannedFood: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  instructions: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  middleRow: {
    flexDirection: 'row',
    height: 200,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scanArea: {
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 220,
    height: 160,
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 12,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingBottom: 40,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 30,
    padding: 12,
  },
  scanInstruction: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});