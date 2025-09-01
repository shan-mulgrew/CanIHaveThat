import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Settings as SettingsIcon, TriangleAlert as AlertTriangle, Info } from 'lucide-react-native';
import { getAllergenSettings, updateAllergenSettings, type AllergenSettings } from '../../utils/allergenSettings';

export default function SettingsScreen() {
  const [allergenSettings, setAllergenSettings] = useState<AllergenSettings>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await getAllergenSettings();
    setAllergenSettings(settings);
  };

  const toggleAllergen = async (allergenName: string) => {
    const newSettings = {
      ...allergenSettings,
      [allergenName]: !allergenSettings[allergenName],
    };
    setAllergenSettings(newSettings);
    await updateAllergenSettings(newSettings);
  };

  const allergens = [
    'Cereals containing gluten',
    'Crustaceans',
    'Eggs',
    'Fish',
    'Peanuts',
    'Soybeans',
    'Milk',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your allergen preferences</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={20} color="#EF4444" />
            <Text style={styles.sectionTitle}>Allergen Monitoring</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Toggle which allergens you want to monitor. Only enabled allergens will trigger warnings.
          </Text>

          <View style={styles.allergenList}>
            {allergens.map((allergen) => (
              <View key={allergen} style={styles.allergenItem}>
                <View style={styles.allergenInfo}>
                  <Text style={styles.allergenName}>{allergen}</Text>
                  <Text style={styles.allergenDescription}>
                    {allergenSettings[allergen] ? 'Monitoring enabled' : 'Monitoring disabled'}
                  </Text>
                </View>
                <Switch
                  value={allergenSettings[allergen] || false}
                  onValueChange={() => toggleAllergen(allergen)}
                  trackColor={{ false: '#d1d5db', true: '#10B981' }}
                  thumbColor={allergenSettings[allergen] ? '#ffffff' : '#f3f4f6'}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>About Irish Allergens</Text>
          </View>
          <Text style={styles.aboutText}>
            This app monitors the top 7 allergens as defined by Irish food safety regulations. 
            These allergens must be clearly labeled on all packaged foods sold in Ireland.
          </Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Why these 7 allergens?</Text>
            <Text style={styles.infoText}>
              These allergens are responsible for the majority of serious allergic reactions 
              and are required by law to be clearly identified on food packaging in Ireland.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
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
  },
  section: {
    marginTop: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  allergenList: {
    gap: 12,
  },
  allergenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  allergenInfo: {
    flex: 1,
  },
  allergenName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  allergenDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  aboutText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
  versionText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});