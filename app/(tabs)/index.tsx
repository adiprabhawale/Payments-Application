import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Send, Globe, DollarSign } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Barclays Payments</Text>
        <Text style={styles.subtitle}>Send money anywhere, anytime</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>$12,458.50</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/domestic-transfer')}
          accessibilityRole="button"
          accessibilityLabel="Domestic Transfer">
          <View style={styles.actionIconContainer}>
            <Send size={32} color="#2563eb" />
          </View>
          <Text style={styles.actionTitle}>Domestic Transfer</Text>
          <Text style={styles.actionDescription}>
            Send money within the country
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/international-transfer')}
          accessibilityRole="button"
          accessibilityLabel="International Transfer">
          <View style={styles.actionIconContainer}>
            <Globe size={32} color="#16a34a" />
          </View>
          <Text style={styles.actionTitle}>International Transfer</Text>
          <Text style={styles.actionDescription}>
            Send money worldwide
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuresContainer}>
        <View style={styles.feature}>
          <DollarSign size={20} color="#0ea5e9" />
          <Text style={styles.featureText}>Low fees</Text>
        </View>
        <View style={styles.feature}>
          <Send size={20} color="#0ea5e9" />
          <Text style={styles.featureText}>Instant transfers</Text>
        </View>
        <View style={styles.feature}>
          <Globe size={20} color="#0ea5e9" />
          <Text style={styles.featureText}>Global reach</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  balanceCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIconContainer: {
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
  },
  feature: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
  },
});